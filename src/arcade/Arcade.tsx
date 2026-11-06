import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Github, Linkedin, Volume2, VolumeX } from 'lucide-react'
import { chip } from './chiptune'
import { achievements, certs, experience, projects } from '../data'
import './arcade.css'

const GITHUB = 'https://github.com/devfaizzz/'
const LINKEDIN = 'https://www.linkedin.com/in/faizzkhann'
const LEVELS: Record<string, [string, string]> = {
  about: ['LEVEL 1', 'ABOUT'], work: ['LEVEL 2', 'PROJECTS'], experience: ['LEVEL 3', 'EXPERIENCE'],
  skills: ['LEVEL 4', 'SKILLS'], recognition: ['LEVEL 5', 'TROPHIES'], contact: ['FINAL', 'CONTACT'],
}
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const STORY = [
  ['PLAYER 1 SPAWNS', 'Prayagraj, 2023. A B.Tech in Computer Science at UCER begins, and curiosity about how software really works.'],
  ['LEVEL 1: THE BACKEND', 'First internship in 2024. Node.js and Express APIs, and the first real backend ships.'],
  ['LEVEL 2: MACHINE LEARNING', '2025. Classification models go live behind a Flask API, built with a team of five.'],
  ['BOSS FIGHTS', 'Hackathons. Runner-up at ArcticX, second runner-up at UUHackDiwas, finalist at Hack18 and Sankalp AI.'],
  ['2026: POWER UPS', 'AWS Student Builder Campus Leader, one of 300 chosen from 10,000+. Google Student Ambassador. Backend work at SRJS Technologies. Teaching tech on the side as Techno Poison.'],
  ['NEXT STAGE', 'Graduating May 2027, still building intelligent systems. Keep scrolling, the road is not over.'],
]
type Phase = 'off' | 'boot' | 'on' | 'exit'
type Toast = { id: number; kind: 'ach' | 'lvl' | 'sys'; title: string; sub: string }
type SceneHandle = { pause: () => void; resume: () => void; dispose: () => void }

function ensureFonts() {
  if (document.getElementById('arcade-fonts')) return
  const l = document.createElement('link'); l.id = 'arcade-fonts'; l.rel = 'stylesheet'
  l.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap'
  document.head.appendChild(l)
}
const fontsReady = () => Promise.race([
  Promise.all([document.fonts.load('12px "Press Start 2P"'), document.fonts.load('20px "VT323"')]).catch(() => null),
  new Promise(r => setTimeout(r, 1800)),
])

export default function Arcade() {
  const [phase, setPhase] = useState<Phase>('off')
  const [score, setScore] = useState(0)
  const [hi, setHi] = useState(() => { try { return +(localStorage.getItem('arcade-hi') || 0) } catch { return 0 } })
  const [level, setLevel] = useState(['START', 'TOP'])
  const [got, setGot] = useState(0)
  const [total, setTotal] = useState(0)
  const [muted, setMuted] = useState(chip.muted)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [win, setWin] = useState(false)
  const [hint, setHint] = useState(false)
  const [no3d, setNo3d] = useState(false)
  const [story, setStory] = useState(-1)
  const [typed, setTyped] = useState(0)
  const phaseRef = useRef<Phase>('off')
  const scoreRef = useRef(0), hiRef = useRef(hi), gotRef = useRef(0), totalRef = useRef(0)
  const canvas = useRef<HTMLCanvasElement>(null), boot = useRef<HTMLDivElement>(null)
  const scene = useRef<SceneHandle | null>(null), tl = useRef<gsap.core.Timeline | null>(null)
  const cleanup = useRef<(() => void)[]>([])
  const queue = useRef<Omit<Toast, 'id'>[]>([]), lastToast = useRef(0), toastTimer = useRef(0), toastId = useRef(0)
  const setPh = (p: Phase) => { phaseRef.current = p; setPhase(p) }

  const add = useCallback((n: number) => {
    scoreRef.current += n; setScore(scoreRef.current)
    if (scoreRef.current > hiRef.current) {
      hiRef.current = scoreRef.current; setHi(hiRef.current)
      try { localStorage.setItem('arcade-hi', String(hiRef.current)) } catch { /* storage unavailable */ }
    }
  }, [])

  const drain = useCallback(() => {
    if (toastTimer.current || !queue.current.length) return
    const wait = Math.max(0, 900 - (performance.now() - lastToast.current))
    toastTimer.current = window.setTimeout(() => {
      toastTimer.current = 0
      const t = queue.current.shift(); if (!t) return
      const id = ++toastId.current; lastToast.current = performance.now()
      setToasts(a => [...a.slice(-2), { ...t, id }])
      window.setTimeout(() => setToasts(a => a.filter(x => x.id !== id)), 3600)
      drain()
    }, wait)
  }, [])
  const toast = useCallback((t: Omit<Toast, 'id'>) => { queue.current.push(t); drain() }, [drain])

  // ---------- go live: theme, scene, music, observers ----------
  const commit = useCallback(async () => {
    const html = document.documentElement
    html.dataset.arcade = 'on'
    chip.start()
    scoreRef.current = 0; gotRef.current = 0; setScore(0); setGot(0)
    const chips = Array.from(document.querySelectorAll<HTMLElement>('.clay'))
    totalRef.current = chips.length; setTotal(chips.length)
    chips.forEach(c => { c.tabIndex = 0; c.setAttribute('role', 'button') })
    const collect = (el: HTMLElement) => {
      if (el.dataset.got) return
      el.dataset.got = '1'; gotRef.current++; setGot(gotRef.current); add(25); chip.sfx('coin')
      if (gotRef.current === totalRef.current) {
        add(1000); chip.sfx('win'); toast({ kind: 'ach', title: 'ALL SKILLS COLLECTED', sub: 'PLAYER 1 CLEARED THE GAME' })
        window.setTimeout(() => setWin(true), 900)
      }
    }
    const onClick = (e: MouseEvent) => { const el = (e.target as HTMLElement).closest<HTMLElement>('.clay'); if (el) collect(el) }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return
      const el = (e.target as HTMLElement).closest<HTMLElement>('.clay'); if (el) { e.preventDefault(); collect(el) }
    }
    document.addEventListener('click', onClick); document.addEventListener('keydown', onKey)

    const seen = new Set<string>()
    const lv = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return
      const id = (en.target as HTMLElement).id
      if (!id) { setLevel(['START', 'TOP']); return }
      const l = LEVELS[id]; if (!l) return
      setLevel(l)
      if (seen.has(id)) return
      seen.add(id); add(100); chip.sfx('level')
      toast({ kind: 'lvl', title: `${l[0]} ${l[0] === 'FINAL' ? 'STAGE' : 'START'}`, sub: id === 'skills' ? 'CLICK THE SKILL CHIPS TO COLLECT THEM' : l[1] })
    }), { rootMargin: '-40% 0px -55% 0px' })
    document.querySelectorAll('.hero, #about, #work, #experience, #skills, #recognition, #contact').forEach(el => lv.observe(el))
    const ach = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return
      ach.unobserve(en.target)
      const el = en.target as HTMLElement
      add(250); chip.sfx('ach')
      toast({ kind: 'ach', title: 'ACHIEVEMENT UNLOCKED', sub: (el.querySelector('strong')?.textContent || '').toUpperCase() })
    }), { threshold: 0.9 })
    document.querySelectorAll('.ach li').forEach(el => ach.observe(el))

    cleanup.current.push(() => {
      document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey)
      lv.disconnect(); ach.disconnect()
      chips.forEach(c => { delete c.dataset.got; c.removeAttribute('tabindex'); c.removeAttribute('role') })
    })

    try {
      const [{ createArcadeScene }] = await Promise.all([import('./scene'), fontsReady()])
      if (phaseRef.current === 'off' || !canvas.current) return
      scene.current = createArcadeScene({
        canvas: canvas.current,
        cabinets: projects.map(p => ({ title: p.title, category: p.category })),
        getMarks: () => {
          const max = Math.max(1, document.documentElement.scrollHeight - innerHeight)
          return Array.from(document.querySelectorAll<HTMLElement>('#work .project')).map(el => {
            const r = el.getBoundingClientRect()
            return Math.min(1, Math.max(0, (r.top + scrollY + r.height / 2 - innerHeight / 2) / max))
          })
        },
        onCoin: n => { add(10 * n); chip.sfx('coin') },
      })
    } catch { setNo3d(true) }
  }, [add, toast])

  const teardown = useCallback(() => {
    document.documentElement.removeAttribute('data-arcade')
    chip.stop()
    scene.current?.dispose(); scene.current = null
    cleanup.current.splice(0).forEach(fn => fn())
    queue.current = []; setToasts([]); setWin(false); setNo3d(false); setStory(-1)
  }, [])

  const enter = useCallback(() => {
    if (phaseRef.current !== 'off') return
    ensureFonts(); chip.init(); chip.sfx('power'); setHint(false)
    try { sessionStorage.setItem('arcade-hint', '1') } catch { /* storage unavailable */ }
    setPh('boot')
  }, [])

  const exit = useCallback(() => {
    if (phaseRef.current !== 'on') return
    chip.sfx('off'); setPh('exit')
  }, [])

  const toggle = useCallback(() => { if (phaseRef.current === 'off') enter(); else exit() }, [enter, exit])

  // boot / shutdown animation
  useEffect(() => {
    const el = boot.current; if (!el) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (phase === 'boot') {
      const lines = el.querySelectorAll('.arc-line')
      if (reduce) { void commit().then(() => { setPh('on'); setStory(0) }); return }
      gsap.set(el, { display: 'flex', opacity: 1, scaleX: 1, scaleY: 0.004 })
      gsap.set(lines, { opacity: 0 })
      const t = (tl.current = gsap.timeline())
      t.to(el, { scaleY: 1, duration: 0.4, ease: 'power4.out' })
        .to(lines, { opacity: 1, duration: 0.01, stagger: 0.34 }, '+=0.05')
        .add(() => { void commit() }, '+=0.45')
        .to(el, { opacity: 0, duration: 0.55, ease: 'power2.in' }, '+=0.7')
        .add(() => { gsap.set(el, { display: 'none' }); setPh('on'); window.setTimeout(() => setStory(0), 900) })
      return () => { t.kill() }
    }
    if (phase === 'exit') {
      if (reduce) { teardown(); setPh('off'); return }
      gsap.set(el, { display: 'flex', opacity: 1, scaleX: 1, scaleY: 1 })
      gsap.set(el.querySelectorAll('.arc-line'), { opacity: 0 })
      const t = (tl.current = gsap.timeline())
      t.from(el, { opacity: 0, duration: 0.12 })
        .to(el, { scaleY: 0.004, duration: 0.3, ease: 'power4.in' })
        .add(() => teardown())
        .to(el, { scaleX: 0, duration: 0.22, ease: 'power2.in' })
        .add(() => { gsap.set(el, { display: 'none' }); setPh('off') })
      return () => { t.kill() }
    }
  }, [phase, commit, teardown])

  useEffect(() => {
    if (story < 0) return
    setTyped(0)
    const full = STORY[story][1].length
    const id = window.setInterval(() => setTyped(n => { if (n >= full) { window.clearInterval(id); return n } if (n % 3 === 0) chip.sfx('pick'); return n + 1 }), 22)
    return () => window.clearInterval(id)
  }, [story])
  const nextStory = () => {
    if (story < 0) return
    if (typed < STORY[story][1].length) { setTyped(STORY[story][1].length); return }
    if (story + 1 < STORY.length) setStory(story + 1); else { setStory(-1); add(200); chip.sfx('level') }
  }

  const skip = () => { if (phaseRef.current === 'boot') tl.current?.timeScale(7) }

  // keyboard: Esc leaves the arcade, Konami code enters it (and pays out a bonus)
  useEffect(() => {
    let k = 0
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (win) setWin(false); else if (story >= 0) setStory(-1); else exit() }
      const want = KONAMI[k], key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      k = key === want ? k + 1 : key === KONAMI[0] ? 1 : 0
      if (k === KONAMI.length) {
        k = 0
        if (phaseRef.current === 'off') enter()
        else if (phaseRef.current === 'on') { add(1000); chip.sfx('ach'); toast({ kind: 'sys', title: 'CHEAT CODE', sub: '+1000 POINTS. NICE.' }) }
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [enter, exit, add, toast, win, story])

  // pause rendering when the tab is hidden; first-visit hint bubble
  useEffect(() => {
    const vis = () => { if (document.hidden) scene.current?.pause(); else scene.current?.resume() }
    document.addEventListener('visibilitychange', vis)
    let seenHint = false
    try { seenHint = sessionStorage.getItem('arcade-hint') === '1' } catch { /* storage unavailable */ }
    const a = seenHint ? 0 : window.setTimeout(() => setHint(true), 3500)
    const b = seenHint ? 0 : window.setTimeout(() => setHint(false), 12500)
    return () => { document.removeEventListener('visibilitychange', vis); clearTimeout(a); clearTimeout(b) }
  }, [])

  const on = phase === 'on', live = phase === 'on' || phase === 'boot'
  const pad = (n: number) => String(n).padStart(6, '0')
  const stats: [string, number][] = [['QUESTS CLEARED', projects.length], ['INTERNSHIPS', experience.length], ['TROPHIES', achievements.length], ['CERTIFICATES', certs.length], ['SKILLS COLLECTED', got]]

  return (
    <>
      <canvas ref={canvas} className={`arc-canvas${no3d ? ' none' : ''}`} aria-hidden="true" />
      <div className="arc-veil" aria-hidden="true" />

      <div className="arc-dock" data-live={live}>
        {hint && !live && <p className="arc-hint" role="status">Psst. There is a hidden arcade in here.</p>}
        <a className="arc-ico" href={GITHUB} target="_blank" rel="noreferrer" aria-label="Faiz on GitHub"><Github size={17} /></a>
        <a className="arc-ico" href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="Faiz on LinkedIn"><Linkedin size={17} /></a>
        <button type="button" className="arc-coin" onClick={toggle} aria-pressed={live}
          aria-label={live ? 'Exit arcade mode' : 'Insert coin: switch this portfolio to retro arcade mode'}>
          <svg className="arc-coin-ico" viewBox="0 0 12 12" width="18" height="18" aria-hidden="true" shapeRendering="crispEdges">
            <path fill="#ffb000" d="M4 0h4v1h2v1h1v2h1v4h-1v2h-1v1H8v1H4v-1H2v-1H1V8H0V4h1V2h1V1h2z" />
            <path fill="#10130a" d="M5 3h2v1h1v1H7V4H5v1h2v1h1v3H7v1H5V9H4V8h1v1h2V7H5V6H4V4h1z" />
          </svg>
          <span>{live ? 'EXIT ARCADE' : 'INSERT COIN'}</span>
        </button>
      </div>

      {on && (
        <div className="arc-hud" role="status" aria-label="Arcade score">
          <span><i>1UP</i> {pad(score)}</span>
          <span className="arc-hi"><i>HI</i> {pad(hi)}</span>
          <span className="arc-lvl">{level[0]} · {level[1]}</span>
          <span className="arc-sk"><i>SKILLS</i> {got}/{total}</span>
          <button type="button" className="arc-story-btn" onClick={() => { chip.sfx('pick'); setStory(0) }}>STORY</button>
          <button type="button" className="arc-mute" onClick={() => { chip.setMuted(!muted); setMuted(!muted) }} aria-label={muted ? 'Unmute music' : 'Mute music'}>
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      )}

      <div className="arc-toasts" aria-live="polite">
        {toasts.map(t => <div key={t.id} className={`arc-toast ${t.kind}`}><b>{t.title}</b><span>{t.sub}</span></div>)}
      </div>

      <div ref={boot} className="arc-boot" onClick={skip} aria-hidden="true">
        <div>
          <p className="arc-line">FAIZ-OS ARCADE BIOS V1.0</p>
          <p className="arc-line">MEMORY CHECK .......... OK</p>
          <p className="arc-line hot">PLAYER 1: FAIZ KHAN</p>
          <p className="arc-line">CLASS: AI ENGINEER / FULL-STACK</p>
          <p className="arc-line">HOME: PRAYAGRAJ &nbsp; GRADUATES: 2027</p>
          <p className="arc-line dim">SCROLL = DRIVE &nbsp;&nbsp; MOUSE = STEER &nbsp;&nbsp; COINS = POINTS</p>
          <p className="arc-line dim">CLICK THE SKILL CHIPS TO COLLECT THEM</p>
          <p className="arc-line blink">READY_</p>
        </div>
      </div>

      {story >= 0 && (
        <div className="arc-story" role="dialog" aria-label="Faiz's story">
          <p className="arc-story-k">STORY MODE · {story + 1}/{STORY.length}</p>
          <h3>{STORY[story][0]}</h3>
          <p className="arc-story-t">{STORY[story][1].slice(0, typed)}<span className="arc-caret">_</span></p>
          <div className="arc-story-b">
            <button type="button" onClick={() => setStory(-1)}>SKIP</button>
            <button type="button" className="go" autoFocus onClick={nextStory}>{story + 1 === STORY.length && typed >= STORY[story][1].length ? 'START GAME' : 'NEXT'} ▸</button>
          </div>
        </div>
      )}

      {win && (
        <div className="arc-win" role="dialog" aria-modal="true" aria-label="Game complete" onClick={e => { if (e.target === e.currentTarget) setWin(false) }}>
          <div className="arc-win-card">
            <p className="arc-win-k">ALL SKILLS COLLECTED</p>
            <h2>PLAYER 1<br />CLEARED</h2>
            <dl>{stats.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <p className="arc-win-score">FINAL SCORE {pad(score)}</p>
            <div className="arc-win-links">
              <a href={GITHUB} target="_blank" rel="noreferrer"><Github size={16} /> GITHUB</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin size={16} /> LINKEDIN</a>
            </div>
            <button type="button" autoFocus onClick={() => setWin(false)}>KEEP PLAYING</button>
          </div>
        </div>
      )}
    </>
  )
}
