import { SKILLS, LINKS } from '../data/skills'

export function LinksSection() {
  return (
    <section data-theme="navy" className="relative w-full px-6 py-24 sm:px-10">
      <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
        <div className="rounded-xl border border-[#2a3a6b] bg-[#0d1640]/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: '#00a1e0' }}
              aria-hidden
            />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#eaf3ff]">
              Salesforce & Web Toolkit
            </h2>
          </div>
          <ul className="space-y-2.5">
            {SKILLS.map((skill) => (
              <li key={skill} className="flex items-center gap-2 text-sm text-[#b7c4e6]">
                <span className="text-[#5fd8ff]">•</span>
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <h2 className="text-2xl font-semibold text-[#eaf3ff]">Find the work</h2>
          <p className="text-sm text-[#b7c4e6]">
            Repos, profiles, and a way to reach me — real links land here as they're ready.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#2a3a6b] bg-[#0d1640] px-4 py-2 text-sm font-medium text-[#eaf3ff] transition-colors hover:border-[#5fd8ff] hover:text-[#5fd8ff]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
