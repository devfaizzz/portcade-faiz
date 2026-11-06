import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react'
import { gallery } from '../data'
// React Bits CircularCarousel is loaded only if src/components/CircularCarousel.jsx exists (see README).
const found = import.meta.glob('./CircularCarousel.jsx')
const loader = found['./CircularCarousel.jsx'] as (() => Promise<{ default: ComponentType<any> }>) | undefined
const Carousel = loader ? lazy(loader) : null

export default function Gallery({ fade = '#0d0e0c' }: { fade?: string }) {
  const [items, setItems] = useState<typeof gallery>([])
  const [w, setW] = useState(innerWidth)
  useEffect(() => {
    let off = false
    Promise.all(gallery.map(g => new Promise<boolean>(r => { const i = new Image(); i.onload = () => r(true); i.onerror = () => r(false); i.src = g.src })))
      .then(ok => { if (!off) setItems(gallery.filter((_, i) => ok[i])) })
    const rs = () => setW(innerWidth)
    addEventListener('resize', rs)
    return () => { off = true; removeEventListener('resize', rs) }
  }, [])
  if (!Carousel || items.length < 3) return null // hidden until the component file and ≥3 images exist
  return (
    <section id="gallery" className="wrap">
      <h2>Project gallery</h2>
      <div className="gallery-stage" data-cursor="Drag">
        <Suspense fallback={null}>
          <Carousel items={items} preset="cylinder" intro="rise" cardWidth={w < 820 ? 150 : 220} aspectRatio={1}
            speed={14} captions gap={25} autoplay="drift" fadeColor={fade} depthFade={0.55} cornerRadius={12} />
        </Suspense>
      </div>
    </section>
  )
}
