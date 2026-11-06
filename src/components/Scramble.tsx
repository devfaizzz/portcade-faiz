import { useEffect, useRef } from 'react'
// Own lightweight scramble effect. Swap for React Bits "DecryptedText"/"ScrambledText" (see README).
const CH = '01{}<>/#_=+'
export default function Scramble({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current!
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = text; return }
    let raf = 0, start = 0
    const tick = (t: number) => {
      if (!start) start = t + delay
      const p = Math.max(0, (t - start) / 900)
      el.textContent = [...text].map((c, i) => c === ' ' || i < p * text.length ? c : CH[(Math.random() * CH.length) | 0]).join('')
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, delay])
  return <span ref={ref} aria-label={text}>{text}</span>
}
