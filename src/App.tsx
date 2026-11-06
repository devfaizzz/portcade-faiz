import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowUpRight, Download, Mail, Phone, Linkedin, Github, MapPin } from 'lucide-react'
import Scramble from './components/Scramble'
import Cursor from './components/Cursor'
import HoldButton from './components/HoldButton'
import Gallery from './components/Gallery'
import ThemeToggle from './components/ThemeToggle'
import Arcade from './arcade/Arcade'
import { optional } from './components/optional'
import { type Project, asset, profile, projects, experience, skills, achievements, community, certs } from './data'
gsap.registerPlugin(ScrollTrigger)
const Network = lazy(() => import('./components/Network'))
// React Bits components: paste the source into src/components/<Name>.jsx + .css to enable (see README)
const ParticleText = optional('ParticleText'), WarpText = optional('WarpText'), TextLoop = optional('TextLoop')

const nav = ['work', 'experience', 'skills', 'recognition', 'contact']

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const [webgl, setWebgl] = useState(false)
  const [cutout, setCutout] = useState(asset('/images/faiz-cutout.png'))
  const [active, setActive] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'))
  const light = theme === 'light'
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* storage unavailable */ }
  }, [theme])

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const canGL = !!document.createElement('canvas').getContext('webgl')
    setWebgl(canGL && !reduce && innerWidth > 820)
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const target = a.getAttribute('href') === '#top' ? 0 : document.querySelector<HTMLElement>(a.getAttribute('href')!)
      if (target === null) return
      e.preventDefault(); lenis.scrollTo(target, { offset: -64, duration: 1.5, easing: t => 1 - Math.pow(1 - t, 4) })
    }
    document.addEventListener('click', onClick)
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero h1 .ln', { yPercent: 110, duration: 1, stagger: .12 })
        .from('.portrait', { clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'power4.inOut' }, '-=.6')
        .from('.hero-meta > *', { y: 24, opacity: 0, stagger: .08, duration: .7 }, '-=.5')
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el =>
        gsap.from(el, { y: 40, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }))
      gsap.to('.portrait img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      nav.forEach(id => ScrollTrigger.create({ trigger: '#' + id, start: 'top 55%', end: 'bottom 55%', onToggle: st => st.isActive && setActive(id) }))
    }, root)
    return () => { document.removeEventListener('click', onClick); ctx.revert(); gsap.ticker.remove(tick); lenis.destroy() }
  }, [])

  const go = (id: string) => { const a = document.createElement('a'); a.href = '#' + id; document.body.appendChild(a); a.click(); a.remove() }

  return (
    <div ref={root}>
      <Cursor />
      <Arcade />
      <header className="nav"><a href="#top" className="logo">FK</a>
        <div className="nav-right"><nav aria-label="Primary">{nav.map(n => <a key={n} href={`#${n}`} className={active === n ? 'active' : ''} aria-current={active === n ? 'true' : undefined}>{n}</a>)}</nav><ThemeToggle light={light} onToggle={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))} /></div></header>

      <main id="top">
        <section className="hero">
          <div className="net">{webgl && <Suspense fallback={null}><Network light={light} /></Suspense>}</div>
          <div className="hero-copy">
            {ParticleText ? (
              <div className="hero-name"><Suspense fallback={<p className="kicker">FAIZ KHAN</p>}>
                <ParticleText text="FAIZ KHAN" particleSize={2.2} density={innerWidth < 820 ? 5 : 4} color="currentColor" highlightColor={light ? '#4f7d00' : '#c6ff3d'}
                  highlightMode="motion" shape="circle" intro="gather" scatter={190} gatherDuration={1600} stagger={420} clickBurst
                  pointerRepel={42} repelRadius={120} idleDrift={0.8} fontSize="clamp(3.5rem, 13vw, 9rem)" fontWeight={800} glow />
              </Suspense></div>
            ) : <p className="kicker"><Scramble text="FAIZ KHAN" /></p>}
            <h1><span className="mask"><span className="ln">Building Intelligent Systems.</span></span>
                {WarpText ? <span className="sr">Engineering What’s Next.</span> : <span className="mask"><span className="ln lime">Engineering What’s Next.</span></span>}</h1>
            {WarpText && (
              <div className="warp-line" aria-hidden="true"><Suspense fallback={null}>
                <WarpText text="Engineering What’s Next." color={light ? '#4f7d00' : '#c6ff3d'} warpStrength={0.08} warpScale={1.7} speed={0.55} lens="bulge"
                  pointerInfluence={0.42} pointerStrength={0.38} refraction={0.018} chromatic={0.35} idleDrift={0.2} ripple clickRipple intro
                  fontSize={116} fontWeight={800} fontFamily="inherit" letterSpacing="-0.06em" lineHeight={0.9} />
              </Suspense></div>
            )}
            <div className="hero-meta">
              <p>Software Developer &amp; AI Engineer focused on full-stack engineering, agentic AI, and building practical technology that solves real-world problems.</p>
              <p className="facts">Computer Science &amp; Engineering undergraduate, Prayagraj, India. Graduating May 2027.</p>
              <div className="cta">
                <span style={{ display: 'contents' }}>
                  <HoldButton size="md" radius={999} holdTime={900} releaseTime={250} wave glow={false} waveAmplitude={6}
                    backgroundColor="#c6ff3d" textColor="#10130a" fillColor="#10130a" fillTextColor="#c6ff3d"
                    doneLabel="Opening work" onHold={() => go('work')} onTap={() => go('work')}>Explore my work</HoldButton>
                </span>
                <a className="btn" href={asset('/Faiz_Khan_Resume.pdf')} download><Download size={16} /> Download resume</a>
                <a className="btn" href="#contact">Let’s connect</a>
              </div>
            </div>
          </div>
          <div className="portrait" data-cursor="Hello"><img src={cutout} onError={() => setCutout(asset('/images/faiz-original.png'))} alt="Faiz Khan, wearing glasses and a white shirt, arms crossed" width={900} height={900} /></div>
        </section>

        {TextLoop && (
          <div className="loop-band"><Suspense fallback={null}>
            <TextLoop text="Backend ✦ Full-Stack ✦ AI Engineering ✦ Generative AI" shape="wave" speed={90} direction="forward" separator="✦"
              curviness={50} fontSize={46} fontWeight={800} letterSpacing={2} uppercase ribbon ribbonColor="#c6ff3d" color="#000000"
              ribbonWidth={86} edgeFade={0} pauseOnHover scrollBoost={0} />
          </Suspense></div>
        )}

        <section id="about" className="about wrap">
          <h2 className="reveal">Code meets curiosity.</h2>
          <div className="reveal two">
            <p>I’m a Computer Science and Engineering undergraduate drawn to backend development, full-stack engineering, AI engineering and generative AI.</p>
            <p>I’ve built REST APIs and full-stack applications, wired machine learning models into Flask services, and put together LLM-powered agent workflows with LangChain.</p>
          </div>
        </section>

        <section id="work" className="wrap">
          <h2 className="reveal">Selected projects</h2>
          {projects.map((p, i) => (
            <article key={p.id} data-cursor="Explore" className={`project reveal ${p.flagship ? 'flag' : ''} ${i % 2 ? 'flip' : ''}`}>
              <ProjectVisual p={p} />
              <div className="body">
                <p className="cat">{p.category}</p>
                <h3>{p.title}</h3>
                <p>{p.blurb}</p>
                <ul>{p.points.map(x => <li key={x}>{x}</li>)}</ul>
                <p className="stack">{p.stack.join(', ')}</p>
                <div className="links">
                  {p.live ? <a href={p.live} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={14} /></a> : null}
                  {p.source ? <a href={p.source} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={14} /></a> : null}
                </div>
              </div>
            </article>))}
        </section>

        <Gallery fade={light ? '#f1eee6' : '#0d0e0c'} />

        <section id="experience" className="wrap">
          <h2 className="reveal">Experience</h2>
          <ol className="timeline">{experience.map(e => (
            <li key={e.org} className="reveal"><time>{e.when}<br />{e.where}</time>
              <div><h3>{e.role}</h3><p className="org">{e.org}</p><ul>{e.items.map(x => <li key={x}>{x}</li>)}</ul></div></li>))}</ol>
        </section>

        <section id="skills" className="wrap">
          <h2 className="reveal">Technical skills</h2>
          <div className="skillgrid">{Object.entries(skills).map(([g, list]) => (
            <div key={g} className="glass reveal"><h3>{g}</h3>
              <ul className="tiles">{list.map(s => <li key={s} className="clay">{s}</li>)}</ul></div>))}</div>
        </section>

        <section id="recognition" className="wrap">
          <h2 className="reveal">Leadership &amp; achievements</h2>
          <ul className="ach">{achievements.map(([a, b]) => <li key={a} className="reveal"><strong>{a}</strong><span>{b}</span></li>)}</ul>
          <div className="trio">
            <div className="reveal"><h3>Community</h3><ul>{community.map(c => <li key={c}>{c}</li>)}</ul></div>
            <div className="reveal"><h3>Education</h3><p>United College of Engineering and Research (UCER)<br />B.Tech, Computer Science and Engineering<br />Oct 2023 – May 2027, Prayagraj<br />GPA 7.98 / 10.0</p></div>
            <div className="reveal"><h3>Certifications</h3><ul>{certs.map(c => <li key={c}>{c}</li>)}</ul></div>
          </div>
        </section>

        <section id="contact" className="contact wrap">
          <h2 className="reveal">Have something interesting to build?</h2>
          <p className="reveal">Open to meaningful conversations, ambitious projects, and opportunities to build useful technology.</p>
          <a className="btn primary big reveal" href={`mailto:${profile.email}`}><Mail size={18} /> {profile.email}</a>
          <ul className="reveal contacts">
            <li><a href={`tel:${profile.phone.replace(/\s/g, '')}`}><Phone size={16} /> {profile.phone}</a></li>
            <li><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a></li>
            <li><a href={profile.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a></li>
            <li><MapPin size={16} /> {profile.location}</li>
          </ul>
        </section>
      </main>
      <footer>© {new Date().getFullYear()} Faiz Khan <a href="#top">Back to top</a></footer>
      <div className="wordmark" aria-hidden="true">FAIZ</div>
    </div>
  )
}

function ProjectVisual({ p }: { p: Project }) {
  const [ok, setOk] = useState(!!p.image)
  return ok ? (
    <div className="viz has-img"><img src={p.image} alt={`${p.title} screenshot`} loading="lazy" onError={() => setOk(false)} /></div>
  ) : (
    <div className="viz" aria-hidden><span>{p.title}</span><small>Custom visual — not a product screenshot</small></div>
  )
}
