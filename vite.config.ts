import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// VITE_BASE is set by the GitHub Pages workflow (e.g. /repo-name/). Vercel/Netlify use '/'.
export default defineConfig({ base: process.env.VITE_BASE || '/', plugins: [react()] })
