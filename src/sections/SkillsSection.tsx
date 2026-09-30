import { useReveal } from '../lib/useReveal'
import { SKILL_GROUPS, CERTIFICATIONS } from '../data/skills'

function SkillCard({ title, items, index }: { title: string; items: string[]; index: number }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className="reveal rounded-2xl border border-navy/10 bg-cream-alt p-5"
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-text">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-navy/5 px-3 py-1 text-xs font-medium text-ink transition-colors hover:bg-amber/15 hover:text-amber-text"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SkillsSection() {
  const certRef = useReveal<HTMLDivElement>()

  return (
    <section id="skills" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-text">What I work with</span>
        <h2 className="text-3xl font-bold text-ink sm:text-4xl">Skills &amp; toolbox</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((group, i) => (
          <SkillCard key={group.title} title={group.title} items={group.items} index={i} />
        ))}
      </div>

      <div ref={certRef} className="reveal mt-10 rounded-2xl border border-navy/10 bg-navy p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-amber">Certifications</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {CERTIFICATIONS.map((cert) => (
            <span key={cert} className="rounded-full bg-cream/10 px-3 py-1 text-xs font-medium text-cream">
              {cert}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
