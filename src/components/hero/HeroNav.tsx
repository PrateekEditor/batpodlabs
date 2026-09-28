import { scrollToSection } from '../../lib/lenis'
import { HOTSPOTS } from './Hotspots'

const corner: Record<string, string> = {
  coder: 'top-8 left-8 sm:top-10 sm:left-16',
  ecommerce: 'top-8 right-8 sm:top-10 sm:right-16',
  about: 'top-1/2 -translate-y-1/2 left-4 sm:left-8',
  biker: 'top-1/2 -translate-y-1/2 right-4 sm:right-8',
}

/**
 * The four clickable "sides" around the hero scene — a plain 2D overlay rather
 * than labels anchored to 3D positions, so it works the same on every device
 * and doesn't depend on the 3D scene finishing its first render.
 */
export function HeroNav() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {HOTSPOTS.map((h) => (
        <button
          key={h.id}
          onClick={() => scrollToSection(h.id)}
          className={`pointer-events-auto absolute ${corner[h.id] ?? ''} rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap backdrop-blur-sm transition-transform hover:scale-105`}
          style={{
            border: `1px solid ${h.color}`,
            background: 'rgba(20,18,16,0.72)',
            color: h.color,
          }}
        >
          {h.label}
        </button>
      ))}
    </div>
  )
}
