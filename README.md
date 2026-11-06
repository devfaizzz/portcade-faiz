# Faiz Khan — Portfolio
React + TypeScript + Vite, GSAP + ScrollTrigger + Lenis, React Three Fiber, Lucide.
## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build && npm run preview
## Photo cutout
`public/images/faiz-cutout.png` was made with OpenCV GrabCut (`python3 cutout.py`). For cleaner hair edges: `pip install rembg` and run `npm run cutout` again (it auto-uses rembg), or replace the PNG with a remove.bg/Photoroom export.
## React Bits
Not bundled (no network when this was generated). Add real components with the official CLI, e.g.
    npx jsrepo add https://reactbits.dev/ts/tailwind/TextAnimations/DecryptedText
(check reactbits.dev for the current command and Tailwind/CSS variant), then replace `src/components/Scramble.tsx`.
## Links to fill
`src/data.ts`: set `live` and `source` for each project (VoiceUp Render URL, GitHub repos). Empty = hidden.
## Deploy
Push to GitHub, import in Vercel/Netlify. Build: `npm run build`, output: `dist`.
## Circular carousel (React Bits)
Paste the official source into `src/components/CircularCarousel.jsx` and `src/components/CircularCarousel.css`
(from https://reactbits.dev/ — JS + CSS variant). The "Project gallery" section then appears automatically
once at least 3 images from `gallery` in `src/data.ts` exist (default: the 4 files in `public/images/projects/`).
## More React Bits components (paste to enable)
Paste each component's JS into `src/components/<Name>.jsx` and its CSS into `src/components/<Name>.css`:
`ParticleText` (big FAIZ KHAN), `WarpText` (Engineering What’s Next.), `TextLoop` (ribbon between hero and About).
Missing file => plain fallback is shown, build still passes.
## Deploy (frontend only, no backend)
This is a static site. Build: `npm run build` -> output `dist`.
- Vercel/Netlify: import repo, framework Vite, build `npm run build`, output `dist`.
- GitHub Pages: push to `main`, then Settings > Pages > Source = "GitHub Actions". The included workflow sets the base path.
## Auto-install of React Bits components
`npm run dev` / `npm run build` first run `scripts/fetch-reactbits.mjs`, which downloads ParticleText, WarpText,
TextLoop and CircularCarousel (JS+CSS) from reactbits.dev into `src/components/` if missing. Needs internet once
(GitHub Actions/Vercel/Netlify have it). If it can't fetch, paste the files manually (see above); the site still builds.
