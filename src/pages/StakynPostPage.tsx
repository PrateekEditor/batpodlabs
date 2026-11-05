import { useState } from 'react'
import { STAKYN_CATEGORIES, STAKYN_POSTS } from '../data/stakyn'
import { Link } from '../lib/router'
import { usePageTitle } from '../lib/usePageTitle'
import { BackLink, SK, StakynShell } from '../components/StakynShell'
import { NotFoundPage } from './NotFoundPage'

// Commands inside a step, so they can be shown as code and copied.
const CMD =
  /(npx [\w@./-]+|brew install [\w.-]+|winget install [^·]+?(?=\s·|$)|cloudflared tunnel --url \S+|claude plugin [\w ./@-]+?(?=$)|pip install [\w-]+|pre-commit install|php -v|\/unslop this page|~\/\.claude\/skills|skills\/unslop|lazygit$)/

function Code({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text.trim())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard can be blocked; the text is still selectable */
    }
  }
  return (
    <span className="mx-0.5 inline-flex max-w-full items-center gap-1 rounded-md border px-1.5 py-0.5 align-middle font-mono text-[13px]" style={{ borderColor: SK.line, background: '#0b0b0f', color: SK.lime }}>
      <code className="break-all">{text.trim()}</code>
      <button type="button" onClick={copy} className="shrink-0 rounded px-1 text-[11px] font-sans font-semibold text-white/50 hover:text-white" aria-label={`Copy ${text.trim()}`}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </span>
  )
}

function StepText({ text }: { text: string }) {
  const parts = text.split(CMD)
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <Code key={i} text={part} /> : <span key={i}>{part}</span>))}
    </>
  )
}

export function StakynPostPage({ slug }: { slug: string }) {
  const post = STAKYN_POSTS.find((p) => p.slug === slug)
  usePageTitle(post ? `${post.name}: ${post.tagline} · Stakyn Labs` : 'Stakyn Labs')
  if (!post) return <NotFoundPage />

  const cat = STAKYN_CATEGORIES.find((c) => c.id === post.category)
  const repoLink = post.links.find((l) => /github/i.test(l.label)) ? null : post.repo
  const related = STAKYN_POSTS.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3)

  return (
    <StakynShell>
      <article className="mx-auto w-full max-w-3xl px-6 pb-16 pt-36 sm:px-10 sm:pt-36">
        <BackLink to="/stakyn">All repos &amp; fixes</BackLink>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
          <span className="rounded-full px-2.5 py-1" style={{ background: '#B8A2FF1f', color: SK.lav }}>
            {post.series} · {post.episode.replace(/\s*\(.*\)/, '')}
          </span>
          {cat && <span className="text-white/45">{cat.label}</span>}
        </div>
        <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">{post.name}</h1>
        <p className="mt-2 text-lg text-white/75">{post.tagline}</p>
        <p className="mt-4 border-l-2 pl-4 text-base italic text-white/55" style={{ borderColor: SK.orange }}>
          “{post.hook}”
        </p>

        {post.facts.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {post.facts.map((f) => (
              <li key={f} className="rounded-full border px-3 py-1 text-sm text-white/80" style={{ borderColor: SK.line }}>
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* links */}
        <div className="mt-8 flex flex-wrap gap-3">
          {repoLink && (
            <a href={repoLink} target="_blank" rel="noreferrer" data-guide="Grab the repo here" className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold text-[#0b0b0f]" style={{ background: SK.lime }}>
              Open on GitHub
            </a>
          )}
          {post.links.map((l, i) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              data-guide={i === 0 && !repoLink ? 'Grab the repo here' : undefined}
              className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold ${i === 0 && !repoLink ? 'text-[#0b0b0f]' : 'border text-white hover:border-white/40'}`}
              style={i === 0 && !repoLink ? { background: SK.lime } : { borderColor: SK.line }}
            >
              {l.label}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          ))}
        </div>

        {/* setup */}
        {post.steps.length > 0 && (
          <section className="mt-10 rounded-2xl border p-6 sm:p-7" style={{ background: SK.panel, borderColor: SK.line }}>
            <h2 data-guide="Copy, paste, done" className="inline-block text-xl font-bold">Setup</h2>
            <ol className="mt-4 space-y-4">
              {post.steps.map((s, i) => (
                <li key={s} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#0b0b0f]" style={{ background: SK.orange }}>
                    {i + 1}
                  </span>
                  <p className="leading-relaxed text-white/85">
                    <StepText text={s} />
                  </p>
                </li>
              ))}
            </ol>
            {post.tips.length > 0 && (
              <div className="mt-5 space-y-1.5 border-t pt-4 text-sm leading-relaxed text-white/60" style={{ borderColor: SK.line }}>
                {post.tips.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            )}
          </section>
        )}

        {/* watch it */}
        {post.live.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/45">Watch the video</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.live.map((l, i) => (
                <a key={l.platform} data-guide={i === 0 ? 'Watch the video' : undefined} href={l.url} target="_blank" rel="noreferrer" className="rounded-full border px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-[#B7F23E] hover:text-white" style={{ borderColor: SK.line }}>
                  {l.platform}
                </a>
              ))}
            </div>
            {post.keyword && (
              <p className="mt-3 text-sm text-white/50">
                Prefer the links in your DMs? Comment <b className="font-mono text-white">{post.keyword}</b> on the reel.
              </p>
            )}
          </section>
        )}

        {post.keywords.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-1.5" aria-label="Topics">
            {post.keywords.map((k) => (
              <li key={k} className="rounded-md px-2 py-0.5 text-xs text-white/45" style={{ background: SK.panel }}>
                #{k.replace(/\s+/g, '')}
              </li>
            ))}
          </ul>
        )}
      </article>

      {related.length > 0 && (
        <section className="mx-auto w-full max-w-3xl px-6 pb-20 sm:px-10">
          <h2 className="text-lg font-bold">More in {cat?.label}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} to={`/stakyn/${p.slug}`} className="rounded-xl border p-4 transition-colors hover:border-[#B7F23E]/60" style={{ background: SK.panel, borderColor: SK.line }}>
                <div className="font-bold">{p.name}</div>
                <div className="mt-0.5 text-sm text-white/60">{p.tagline}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </StakynShell>
  )
}
