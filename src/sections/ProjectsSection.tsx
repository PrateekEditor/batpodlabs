import { useRef } from 'react'
import { PROJECTS } from '../data/projects'

export function ProjectsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null)

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  return (
    <section data-theme="cream" className="relative w-full px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 inline-block rounded bg-[#1c1a16] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#f2e9d8]">
          Selected
        </div>
        <h2 className="mb-8 text-4xl font-bold text-[#1c1a16] sm:text-5xl">Projects</h2>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PROJECTS.map((p) => (
            <a
              key={p.title}
              href={p.url ?? undefined}
              target={p.url ? '_blank' : undefined}
              rel={p.url ? 'noreferrer' : undefined}
              className="group w-[300px] flex-shrink-0 snap-start rounded-xl border border-[#e0d5bd] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="inline-block rounded-full bg-[#f2e9d8] px-2.5 py-1 text-[11px] font-semibold text-[#8a6b2a]">
                {p.tag}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-[#1c1a16]">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4a4535]">{p.description}</p>
            </a>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Previous project"
            className="rounded-full border border-[#e0d5bd] p-2 text-[#1c1a16] hover:border-[#1c1a16]"
          >
            ‹
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Next project"
            className="rounded-full border border-[#e0d5bd] p-2 text-[#1c1a16] hover:border-[#1c1a16]"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
