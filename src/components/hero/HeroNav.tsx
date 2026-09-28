import { scrollToSection } from '../../lib/lenis'
import { HOTSPOTS } from './Hotspots'

/**
 * A clean glass top navbar linking the 4 sides, in the spirit of both
 * reference sites' nav bars — replaces the earlier scattered corner pins.
 */
export function HeroNav() {
  return (
    <nav className="pointer-events-auto absolute left-1/2 top-6 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-2 backdrop-blur-md sm:top-8">
      {HOTSPOTS.map((h) => (
        <button
          key={h.id}
          onClick={() => scrollToSection(h.id)}
          className="rounded-full px-4 py-1.5 text-sm font-medium text-white/75 transition-colors hover:text-white"
          onMouseEnter={(e) => (e.currentTarget.style.color = h.color)}
          onMouseLeave={(e) => (e.currentTarget.style.color = '')}
        >
          {h.label}
        </button>
      ))}
    </nav>
  )
}
