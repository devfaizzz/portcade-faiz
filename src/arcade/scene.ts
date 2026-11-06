import * as THREE from 'three'

export type Cab = { title: string; category: string }
export type SceneOpts = {
  canvas: HTMLCanvasElement
  cabinets: Cab[]
  getMarks: () => number[] // 0..1 scroll position of each project, same order as cabinets
  onCoin: (n: number) => void
}

const L = 260 // road length the whole page scroll maps onto
const LIME = new THREE.Vector3(0.776, 1, 0.239)
const HOT = new THREE.Vector3(1, 0.3, 0.18)
const BG = new THREE.Vector3(0.039, 0.047, 0.024)
const FONT = '"Press Start 2P", ui-monospace, monospace'

function fit(g: CanvasRenderingContext2D, text: string, maxW: number, size: number) {
  let s = size
  do { g.font = `${s}px ${FONT}`; s -= 1 } while (g.measureText(text).width > maxW && s > 6)
}

function wrap(g: CanvasRenderingContext2D, text: string, maxW: number) {
  const out: string[] = []; let line = ''
  for (const w of text.split(' ')) {
    const t = line ? line + ' ' + w : w
    if (g.measureText(t).width > maxW && line) { out.push(line); line = w } else line = t
  }
  if (line) out.push(line)
  return out
}

function screenTexture(c: Cab, i: number) {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 240
  const g = cv.getContext('2d')!
  g.fillStyle = '#060803'; g.fillRect(0, 0, 256, 240)
  g.fillStyle = 'rgba(198,255,61,.08)'; for (let y = 0; y < 240; y += 4) g.fillRect(0, y, 256, 2)
  g.strokeStyle = '#c6ff3d'; g.lineWidth = 4; g.strokeRect(6, 6, 244, 228)
  g.textBaseline = 'top'
  g.fillStyle = '#ffb000'; g.font = `9px ${FONT}`; g.fillText(`STAGE 0${i + 1}`, 18, 20)
  g.fillStyle = '#c6ff3d'; g.font = `15px ${FONT}`
  wrap(g, c.title.toUpperCase(), 220).slice(0, 3).forEach((l, k) => g.fillText(l, 18, 52 + k * 24))
  g.fillStyle = '#efe9d4'; g.font = `7px ${FONT}`
  wrap(g, c.category.toUpperCase(), 220).slice(0, 3).forEach((l, k) => g.fillText(l, 18, 140 + k * 13))
  g.fillStyle = '#ff4d2e'; g.font = `9px ${FONT}`; g.fillText('PRESS START', 18, 206)
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter
  return t
}

function marqueeTexture(title: string) {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 56
  const g = cv.getContext('2d')!
  g.fillStyle = '#10150a'; g.fillRect(0, 0, 256, 56)
  g.strokeStyle = '#ff4d2e'; g.lineWidth = 3; g.strokeRect(3, 3, 250, 50)
  g.fillStyle = '#c6ff3d'; g.textBaseline = 'middle'; g.textAlign = 'center'
  fit(g, title.toUpperCase(), 224, 16); g.fillText(title.toUpperCase(), 128, 30)
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter
  return t
}

function buildCabinet(c: Cab, i: number) {
  const group = new THREE.Group()
  // side profile (x = toward the player, y = up), extruded along z for the width
  const p = new THREE.Shape()
  const pts: [number, number][] = [[0, 0], [1.6, 0], [1.6, 1], [2.05, 1.14], [2.05, 1.3], [1.5, 1.45], [1.36, 2.8], [1.58, 3.08], [1.58, 3.55], [0, 3.55]]
  p.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(([x, y]) => p.lineTo(x, y)); p.closePath()
  const body = new THREE.ExtrudeGeometry(p, { depth: 1.5, bevelEnabled: false })
  body.translate(0, 0, -0.75)
  const mat = new THREE.MeshLambertMaterial({ color: 0x15190d })
  group.add(new THREE.Mesh(body, mat))
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(body), new THREE.LineBasicMaterial({ color: 0xc6ff3d, transparent: true, opacity: 0.55 }))
  group.add(edges)
  // screen, leaning back with the glass
  const lean = new THREE.Group(); lean.position.set(1.46, 2.12, 0); lean.rotation.z = Math.atan(0.14 / 1.35)
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture(c, i), toneMapped: false })
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.22, 1.2), screenMat); screen.rotation.y = Math.PI / 2
  lean.add(screen); group.add(lean)
  const marq = new THREE.Mesh(new THREE.PlaneGeometry(1.34, 0.3), new THREE.MeshBasicMaterial({ map: marqueeTexture(c.title), toneMapped: false }))
  marq.position.set(1.595, 3.32, 0); marq.rotation.y = Math.PI / 2; group.add(marq)
  // joystick + buttons on the control deck
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.26, 8), new THREE.MeshLambertMaterial({ color: 0x050603 }))
  stick.position.set(1.78, 1.36, -0.32); group.add(stick)
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff4d2e }))
  ball.position.set(1.78, 1.52, -0.32); group.add(ball)
  ;[0xc6ff3d, 0xffb000, 0xff4d2e].forEach((col, k) => {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12), new THREE.MeshBasicMaterial({ color: col }))
    b.position.set(1.8 + (k % 2) * 0.12, 1.25, 0.1 + k * 0.17); group.add(b)
  })
  group.scale.setScalar(1.15)
  return { group, screenMat }
}

export function createArcadeScene(o: SceneOpts) {
  const small = innerWidth < 820
  const renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: !small, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1 : 1.6))
  renderer.setSize(innerWidth, innerHeight, false)
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0c06)
  scene.fog = new THREE.Fog(0x0a0c06, 22, 125)
  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 500)
  camera.position.set(0, 2.1, 0)
  scene.add(new THREE.HemisphereLight(0xffd9a0, 0x1a2008, 1.1))
  const sunLight = new THREE.DirectionalLight(0xc6ff3d, 0.7); sunLight.position.set(-4, 6, 3); scene.add(sunLight)

  // floor: world-space neon grid with a lit road and dashed centre line
  const floorMat = new THREE.ShaderMaterial({
    uniforms: { uCam: { value: new THREE.Vector3() }, uLime: { value: LIME }, uHot: { value: HOT }, uBg: { value: BG } },
    vertexShader: 'varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader: `uniform vec3 uCam,uLime,uHot,uBg;varying vec3 vW;
      float grid(vec2 p,float s,float w){vec2 q=p/s;vec2 g=abs(fract(q-.5)-.5)/fwidth(q);return 1.-min(min(g.x,g.y)/w,1.);}
      void main(){
        float d=distance(vW.xz,uCam.xz);float fade=1.-smoothstep(30.,125.,d);
        float ax=abs(vW.x);
        float road=1.-smoothstep(3.55,3.7,ax);
        float edge=smoothstep(3.2,3.3,ax)*(1.-smoothstep(3.5,3.6,ax));
        float dash=step(.5,fract(vW.z/5.))*(1.-smoothstep(.1,.16,ax));
        float side=max(grid(vW.xz,2.,1.1)*.5,grid(vW.xz,10.,1.6))*(1.-road);
        vec3 c=uBg;
        c=mix(c,uLime,side*.8);
        c=mix(c,vec3(.055,.065,.035),road);
        c+=uLime*edge*.85;
        c+=uHot*dash*road*.9;
        c=mix(uBg,c,fade);
        gl_FragColor=vec4(c,1.);
      }`,
  })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(520, 520), floorMat)
  floor.rotation.x = -Math.PI / 2; scene.add(floor)

  // sky group follows the camera so the horizon never gets closer
  const sky = new THREE.Group(); scene.add(sky)
  const sunMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `varying vec2 vUv;
      void main(){vec2 p=vUv-.5;if(length(p)>.5)discard;float y=vUv.y;
        float t=clamp((.55-y)/.55,0.,1.);float th=t*.75;
        if(y<.55&&fract(y*17.)<th)discard;
        vec3 top=vec3(1.,.69,0.),bot=vec3(1.,.24,.12);
        gl_FragColor=vec4(mix(bot,top,smoothstep(.1,.95,y)),1.);}`,
  })
  const sun = new THREE.Mesh(new THREE.CircleGeometry(34, 64), sunMat)
  sun.position.set(0, 20, -200); sky.add(sun)

  const ridge = new THREE.Shape(); ridge.moveTo(-300, -10)
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const ridgePts: THREE.Vector3[] = []
  for (let x = -300; x <= 300; x += 14) {
    const h = 6 + rnd() * 20 * (0.35 + Math.abs(x) / 300)
    ridge.lineTo(x, h); ridgePts.push(new THREE.Vector3(x, h, 0))
  }
  ridge.lineTo(300, -10); ridge.closePath()
  const mountains = new THREE.Mesh(new THREE.ShapeGeometry(ridge), new THREE.MeshBasicMaterial({ color: 0x0f140a, fog: false }))
  const ridgeLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ridgePts), new THREE.LineBasicMaterial({ color: 0xc6ff3d, transparent: true, opacity: 0.55, fog: false }))
  mountains.position.set(0, 0, -180); ridgeLine.position.set(0, 0, -179.9); sky.add(mountains, ridgeLine)

  const starN = small ? 220 : 520, sp = new Float32Array(starN * 3)
  for (let i = 0; i < starN; i++) {
    const a = rnd() * Math.PI * 2, r = 230, y = 18 + rnd() * 120
    sp[i * 3] = Math.cos(a) * r * (0.4 + rnd() * 0.6); sp[i * 3 + 1] = y; sp[i * 3 + 2] = -Math.abs(Math.sin(a)) * r - 20
  }
  const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xefe9d4, size: 2, sizeAttenuation: false, transparent: true, opacity: 0.8, fog: false }))
  sky.add(stars)

  // roadside posts
  const postCount = 44, posts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, 2.2, 0.1), new THREE.MeshBasicMaterial({ color: 0xc6ff3d }), postCount * 2)
  const m4 = new THREE.Matrix4()
  for (let i = 0; i < postCount; i++) for (const s of [-1, 1]) {
    m4.makeTranslation(s * 4.3, 1.1, -i * 7 + 6); posts.setMatrixAt(i * 2 + (s > 0 ? 1 : 0), m4)
  }
  scene.add(posts)

  // cabinets: one per project, placed ahead of the camera at that project's scroll position
  const cabs = o.cabinets.map((c, i) => { const b = buildCabinet(c, i); scene.add(b.group); return b })
  const place = () => {
    const marks = o.getMarks(), halfH = Math.atan(Math.tan(THREE.MathUtils.degToRad(31)) * camera.aspect)
    const dist = 10, x = dist * Math.tan(halfH) * (camera.aspect > 1 ? 0.8 : 0.72)
    cabs.forEach((c, i) => {
      const side = i % 2 ? 1 : -1, m = marks[i] ?? i / Math.max(1, cabs.length - 1)
      c.group.position.set(side * Math.max(5, x), 0, -m * L - dist)
      c.group.rotation.y = side < 0 ? -0.55 : Math.PI + 0.55 // face the road, angled back toward the viewer
    })
  }
  place()

  // coins
  const coinGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.07, 18); coinGeo.rotateX(Math.PI / 2)
  const coinMat = new THREE.MeshBasicMaterial({ color: 0xffb000 })
  const rimMat = new THREE.LineBasicMaterial({ color: 0xfff1b0 })
  const rimGeo = new THREE.EdgesGeometry(coinGeo, 40)
  type Coin = { m: THREE.Group; z: number; x: number; t: number; got: boolean }
  const coins: Coin[] = []
  const coinCount = small ? 34 : 54
  for (let i = 0; i < coinCount; i++) {
    const g = new THREE.Group(); g.add(new THREE.Mesh(coinGeo, coinMat), new THREE.LineSegments(rimGeo, rimMat))
    const z = -(10 + (i / coinCount) * (L - 6) + rnd() * 3), x = (rnd() - 0.5) * 5.4
    g.position.set(x, 1.1, z); scene.add(g); coins.push({ m: g, z, x, t: 0, got: false })
  }

  const touch = matchMedia('(pointer:coarse)').matches
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const pointer = { x: 0, y: 0 }
  const onMove = (e: PointerEvent) => { pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = (e.clientY / innerHeight) * 2 - 1 }
  addEventListener('pointermove', onMove, { passive: true })
  const onResize = () => {
    renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); place()
  }
  addEventListener('resize', onResize)
  const ro = new ResizeObserver(() => place()); ro.observe(document.body)

  let raf = 0, last = performance.now(), prog = 0, camX = 0, prevZ = 0, running = true
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    const max = document.documentElement.scrollHeight - innerHeight
    const target = max > 0 ? THREE.MathUtils.clamp(scrollY / max, 0, 1) : 0
    prog += (target - prog) * (1 - Math.exp(-dt * 5))
    const cz = -prog * L
    const wantX = touch ? Math.sin(cz * 0.11) * 2.4 : pointer.x * 3
    const vx = (wantX - camX) * (1 - Math.exp(-dt * 4)); camX += vx
    const t = now / 1000
    camera.position.set(camX, 2.1 + (reduced ? 0 : Math.sin(t * 1.3) * 0.03), cz)
    camera.lookAt(camX * 0.4, 4.4 - pointer.y * 0.5, cz - 30)
    camera.rotation.z -= vx * 0.35
    floor.position.set(0, 0, cz - 120); floorMat.uniforms.uCam.value.set(camX, camera.position.y, cz)
    sky.position.z = cz
    stars.material.opacity = 0.65 + 0.15 * Math.sin(t * 2)
    sun.scale.setScalar(1 + (reduced ? 0 : Math.sin(t * 0.8) * 0.012))
    cabs.forEach((c, i) => { const f = 0.9 + 0.1 * Math.sin(t * 7 + i); c.screenMat.color.setScalar(f) })

    // coins: collect any whose z the camera crossed this frame (steer with the pointer to line up)
    if (prog < 0.008 && coins.some(c => c.got)) coins.forEach(c => { c.got = false; c.t = 0; c.m.visible = true; c.m.scale.setScalar(1); c.m.position.set(c.x, 1.1, c.z) })
    let got = 0
    const reach = touch ? 1.7 : 1.05
    for (const c of coins) {
      if (c.got) {
        if (c.t > 0 && c.t < 1) { c.t += dt * 4; c.m.scale.setScalar(1 + c.t * 1.4); c.m.position.y = 1.1 + c.t * 1.2; if (c.t >= 1) c.m.visible = false }
        continue
      }
      c.m.rotation.y = t * 2.4 + c.z
      if (c.z <= prevZ + 0.4 && c.z >= cz - 0.4 && Math.abs(c.x - camX) < reach && got < 5) { c.got = true; c.t = 0.01; got++ }
    }
    prevZ = cz
    if (got) o.onCoin(got)
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(frame)

  return {
    pause() { if (running) { running = false; cancelAnimationFrame(raf) } },
    resume() { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame) } },
    dispose() {
      running = false; cancelAnimationFrame(raf); ro.disconnect()
      removeEventListener('pointermove', onMove); removeEventListener('resize', onResize)
      scene.traverse(obj => {
        const m = obj as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mat = m.material as THREE.Material | THREE.Material[] | undefined
        if (mat) (Array.isArray(mat) ? mat : [mat]).forEach(x => { (x as THREE.MeshBasicMaterial).map?.dispose(); x.dispose() })
      })
      renderer.dispose(); renderer.forceContextLoss()
    },
  }
}
