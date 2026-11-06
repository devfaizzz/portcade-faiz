// Tiny WebAudio chiptune engine: an original 8-bar loop in A minor (bass, arpeggio, lead, drums) plus sound effects.
// Nothing is downloaded; every sound is synthesised in the browser. Audio only starts after a user click.
const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12)
const BPM = 124
const STEP = 60 / BPM / 4 // one sixteenth note

const ROOTS = [45, 41, 48, 43] // Am F C G
const CHORDS = [[57, 60, 64, 69], [53, 57, 60, 65], [55, 60, 64, 67], [55, 59, 62, 67]]
const BASS_STEPS: Record<number, number> = { 0: 0, 2: 0, 3: 12, 6: 0, 8: 0, 10: 0, 11: 12, 14: 7 }
const ARP = [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 1, 2, 3]
// [step, midi, length in steps]
const LEAD: [number, number, number][][] = [
  [[0, 76, 2], [3, 72, 1], [4, 74, 2], [6, 72, 2], [8, 69, 4], [12, 72, 2], [14, 74, 2]],
  [[0, 77, 2], [3, 74, 1], [4, 72, 2], [6, 69, 2], [8, 72, 4], [12, 74, 2], [14, 77, 2]],
  [[0, 76, 2], [2, 79, 2], [4, 76, 2], [6, 72, 2], [8, 67, 4], [12, 72, 2], [14, 76, 2]],
  [[0, 74, 2], [3, 71, 1], [4, 74, 2], [6, 79, 2], [8, 78, 2], [10, 74, 2], [12, 71, 4]],
  [[0, 81, 3], [4, 79, 1], [5, 76, 1], [6, 72, 2], [8, 76, 4], [12, 79, 2], [14, 76, 2]],
  [[0, 77, 3], [4, 81, 1], [5, 77, 1], [6, 72, 2], [8, 77, 4], [12, 81, 4]],
  [[0, 79, 2], [2, 76, 2], [4, 72, 2], [6, 76, 2], [8, 79, 4], [12, 84, 2], [14, 79, 2]],
  [[0, 83, 2], [2, 79, 2], [4, 74, 2], [6, 79, 2], [8, 83, 4], [12, 79, 4]],
]

class Chip {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private bus!: AudioNode
  private noise!: AudioBuffer
  private pulse25!: PeriodicWave
  private pulse50!: PeriodicWave
  private timer = 0
  private step = 0
  private nextTime = 0
  private running = false
  muted = false

  constructor() {
    try { this.muted = localStorage.getItem('arcade-muted') === '1' } catch { /* storage unavailable */ }
  }

  init() {
    if (this.ctx) { void this.ctx.resume(); return }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = (this.ctx = new AC())
    this.master = ctx.createGain()
    this.master.gain.value = this.muted ? 0 : 0.2
    const comp = ctx.createDynamicsCompressor()
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 9000
    lp.connect(comp); comp.connect(this.master); this.master.connect(ctx.destination)
    this.bus = lp
    const n = ctx.sampleRate
    this.noise = ctx.createBuffer(1, n, n)
    const d = this.noise.getChannelData(0)
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1
    this.pulse25 = this.makePulse(0.25); this.pulse50 = this.makePulse(0.5)
    document.addEventListener('visibilitychange', this.onVis)
  }

  private onVis = () => {
    if (!this.ctx) return
    if (document.hidden) void this.ctx.suspend(); else if (this.running) void this.ctx.resume()
  }

  private makePulse(duty: number) {
    const ctx = this.ctx!, N = 32
    const real = new Float32Array(N), imag = new Float32Array(N)
    for (let n = 1; n < N; n++) real[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty)
    return ctx.createPeriodicWave(real, imag)
  }

  private tone(freq: number, t: number, dur: number, gain: number, wave: 'tri' | 'p25' | 'p50' | 'saw', glideTo?: number) {
    const ctx = this.ctx!
    const o = ctx.createOscillator(), g = ctx.createGain()
    if (wave === 'tri') o.type = 'triangle'; else if (wave === 'saw') o.type = 'sawtooth'
    else o.setPeriodicWave(wave === 'p25' ? this.pulse25 : this.pulse50)
    o.frequency.setValueAtTime(freq, t)
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.006)
    g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.03, dur))
    o.connect(g); g.connect(this.bus)
    o.start(t); o.stop(t + dur + 0.05)
  }

  private hit(t: number, kind: 'kick' | 'snare' | 'hat' | 'open') {
    const ctx = this.ctx!
    if (kind === 'kick') {
      const o = ctx.createOscillator(), g = ctx.createGain()
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12)
      g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
      o.connect(g); g.connect(this.bus); o.start(t); o.stop(t + 0.2)
      return
    }
    const src = ctx.createBufferSource(); src.buffer = this.noise
    const f = ctx.createBiquadFilter(), g = ctx.createGain()
    f.type = kind === 'snare' ? 'bandpass' : 'highpass'; f.frequency.value = kind === 'snare' ? 1800 : 7000
    const len = kind === 'snare' ? 0.13 : kind === 'open' ? 0.12 : 0.035
    g.gain.setValueAtTime(kind === 'snare' ? 0.55 : 0.18, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len)
    src.connect(f); f.connect(g); g.connect(this.bus); src.start(t, Math.random() * 0.5); src.stop(t + len + 0.02)
  }

  private schedule(step: number, t: number) {
    const bar = Math.floor(step / 16) % 8, s = step % 16, ch = bar % 4
    if (s in BASS_STEPS) this.tone(mtof(ROOTS[ch] + BASS_STEPS[s]), t, STEP * 1.8, 0.5, 'tri')
    this.tone(mtof(CHORDS[ch][ARP[s] % 4] + (s % 8 > 3 ? 12 : 0)), t, STEP * 0.9, 0.07, 'p25')
    for (const [at, note, len] of LEAD[bar]) if (at === s) this.tone(mtof(note), t, STEP * len * 0.92, 0.11, 'p50')
    if (s % 4 === 0 || (s === 10 && bar % 2)) this.hit(t, 'kick')
    if (s === 4 || s === 12) this.hit(t, 'snare')
    if (s % 2 === 0) this.hit(t, s === 14 ? 'open' : 'hat')
  }

  private tick = () => {
    if (!this.ctx) return
    while (this.nextTime < this.ctx.currentTime + 0.15) {
      this.schedule(this.step, this.nextTime)
      this.nextTime += STEP; this.step = (this.step + 1) % (16 * 8)
    }
  }

  start() {
    if (!this.ctx || this.running) return
    this.running = true; this.step = 0; this.nextTime = this.ctx.currentTime + 0.08
    this.timer = window.setInterval(this.tick, 25)
  }

  stop() {
    this.running = false
    window.clearInterval(this.timer)
  }

  setMuted(m: boolean) {
    this.muted = m
    try { localStorage.setItem('arcade-muted', m ? '1' : '0') } catch { /* storage unavailable */ }
    if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.2, this.ctx.currentTime, 0.03)
  }

  sfx(name: 'coin' | 'level' | 'ach' | 'power' | 'off' | 'win' | 'pick') {
    if (!this.ctx || this.muted) return
    const t = this.ctx.currentTime + 0.01
    const arp = (notes: number[], gap: number, dur: number, g = 0.22) => notes.forEach((n, i) => this.tone(mtof(n), t + i * gap, dur, g, 'p50'))
    switch (name) {
      case 'coin': this.tone(mtof(83), t, 0.07, 0.2, 'p50'); this.tone(mtof(88), t + 0.07, 0.3, 0.2, 'p50'); break
      case 'pick': this.tone(mtof(76), t, 0.05, 0.16, 'p25'); break
      case 'level': arp([72, 76, 79, 84], 0.07, 0.12); break
      case 'ach': arp([79, 83, 86, 91], 0.08, 0.16); break
      case 'win': arp([72, 76, 79, 84, 79, 84, 88, 91], 0.09, 0.2); break
      case 'power': this.tone(70, t, 0.55, 0.22, 'saw', 900); this.tone(mtof(84), t + 0.5, 0.25, 0.14, 'p50'); break
      case 'off': this.tone(900, t, 0.35, 0.2, 'saw', 60); break
    }
  }
}

export const chip = new Chip()
