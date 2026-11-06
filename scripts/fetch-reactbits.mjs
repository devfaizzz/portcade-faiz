// Downloads the official React Bits sources (JS + CSS) into src/components if they are missing.
// Runs automatically before `npm run dev` and `npm run build`. Never fails the build.
import { mkdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'

const dir = 'src/components'
const names = ['ParticleText', 'WarpText', 'TextLoop', 'CircularCarousel']
const exists = f => access(f).then(() => true, () => false)

await mkdir(dir, { recursive: true })
for (const n of names) {
  if ((await exists(`${dir}/${n}.jsx`)) && (await exists(`${dir}/${n}.css`))) continue
  try {
    const res = await fetch(`https://reactbits.dev/r/${n}-JS-CSS.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const files = (json.files || []).filter(f => /\.(jsx|css)$/.test(f.path))
    if (!files.length) throw new Error('no jsx/css files in registry response')
    for (const f of files) await writeFile(path.join(dir, path.basename(f.path)), f.content)
    console.log(`✓ React Bits: added ${n}`)
  } catch (e) {
    console.warn(`! React Bits: could not fetch ${n} (${e.message}). Paste it manually, see README.`)
  }
}
