// Glassmorphism dark/light switch (from the supplied Figma design): tall glass knob over a pill track.
export default function ThemeToggle({ light, onToggle }: { light: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="tgl" role="switch" aria-checked={light} aria-label="Switch between dark and light mode" onClick={onToggle}>
      <span className="tgl-track">
        <span className="tgl-label tgl-dark">Dark</span>
        <span className="tgl-label tgl-light">Light</span>
      </span>
      <span className="tgl-knob" aria-hidden="true">
        <svg className="tgl-moon" viewBox="0 0 24 24"><path d="M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a.7.7 0 0 0-.9-.9A9.6 9.6 0 1 0 21.3 15.5a.7.7 0 0 0-.9-.9Z" fill="currentColor" /></svg>
        <svg className="tgl-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
          <path d="M12 2.8v1.6M12 19.6v1.6M2.8 12h1.6M19.6 12h1.6M5.5 5.5l1.1 1.1M17.4 17.4l1.1 1.1M5.5 18.5l1.1-1.1M17.4 6.6l1.1-1.1" />
        </svg>
      </span>
    </button>
  )
}
