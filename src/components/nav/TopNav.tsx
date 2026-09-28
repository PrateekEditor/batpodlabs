import { SECTIONS, type SectionDef } from '../../data/sections'

export function TopNav({
  active,
  onChange,
}: {
  active: SectionDef['id']
  onChange: (id: SectionDef['id']) => void
}) {
  return (
    <header className="fixed left-1/2 top-6 z-30 -translate-x-1/2 sm:top-8">
      <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1.5 backdrop-blur-md">
        {SECTIONS.map((s) => {
          const isActive = s.id === active
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5"
              style={{ color: isActive ? '#141413' : 'rgba(255,255,255,0.75)' }}
            >
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full transition-colors"
                  style={{ background: s.accent }}
                  aria-hidden
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}
