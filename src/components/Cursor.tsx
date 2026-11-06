import { useEffect, useRef } from 'react'
import gsap from 'gsap'
// Classic black pointer with a white outline. Fine pointers only.
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return
    const node = el.current!
    document.documentElement.classList.add('has-cursor')
    const x = gsap.quickTo(node, 'x', { duration: 0.18, ease: 'power3.out' })
    const y = gsap.quickTo(node, 'y', { duration: 0.18, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      x(e.clientX); y(e.clientY); node.style.opacity = '1'
      node.classList.toggle('hot', !!(e.target as HTMLElement).closest('a,button,[data-cursor]'))
    }
    const down = () => node.classList.add('down'), up = () => node.classList.remove('down')
    const out = () => { node.style.opacity = '0' }
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerdown', down); addEventListener('pointerup', up)
    document.documentElement.addEventListener('mouseleave', out)
    return () => {
      removeEventListener('pointermove', move); removeEventListener('pointerdown', down); removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('mouseleave', out)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])
  return (
    <div ref={el} className="fcursor" aria-hidden>
      <svg width="30" height="30" viewBox="0 0 30 30">
        <path d="M3 3 23 11 13.7 14.5 10.6 23.3Z" fill="#fff" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
        <path d="M3 3 23 11 13.7 14.5 10.6 23.3Z" fill="#000" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
