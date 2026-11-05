import { useEffect, useRef, useState, type FormEvent } from 'react'
import { STAKYN_POSTS, type StakynPost } from '../data/stakyn'
import { navigate } from '../lib/router'
import { StakynLogo } from './StakynLogo'

/**
 * Stakyn on the Stakyn Labs pages: a repo finder. Type the keyword from a
 * reel (the one people comment to get the DM) or describe the problem,
 * and it answers with the repo and setup, like the DM does. Keyword and
 * word matching only for now; a real model can replace `answer()` later.
 */

type Msg =
  | { id: number; from: 'me'; text: string }
  | { id: number; from: 'bot'; text: string; posts?: StakynPost[]; chips?: string[] }

const K = { bg: '#0b0b0f', panel: '#15151c', raised: '#1d1d27', line: '#2a2a36', lime: '#B7F23E', lav: '#B8A2FF', orange: '#E86A2F' }

const KEYWORDS = STAKYN_POSTS.filter((p) => p.keyword).map((p) => p.keyword)
const stars = (p: StakynPost) => {
  const f = p.facts.find((x) => /⭐/.test(x))
  const m = f?.match(/([\d.]+)\s*k/i)
  return m ? parseFloat(m[1]) * 1000 : 0
}
const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9.+#\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
const STOP = new Set(['the', 'and', 'for', 'how', 'can', 'you', 'your', 'with', 'what', 'want', 'need', 'give', 'show', 'tool', 'repo', 'some', 'free', 'please', 'help', 'about', 'any', 'that', 'this', 'have', 'from', 'get'])

function answer(input: string): Omit<Extract<Msg, { from: 'bot' }>, 'id' | 'from'> {
  const q = input.trim()
  const kw = STAKYN_POSTS.find((p) => p.keyword && p.keyword.toLowerCase() === q.toLowerCase())
  if (kw) return { text: `Here’s your ${kw.keyword} guide 👇`, posts: [kw] }

  if (/\b(best|top|popular|favou?rite|trending|recommend)\b/i.test(q)) {
    const top = [...STAKYN_POSTS].filter((p) => p.repo).sort((a, b) => stars(b) - stars(a)).slice(0, 3)
    return { text: 'The most-starred repos we’ve posted so far:', posts: top }
  }
  if (/\b(all|list|everything|every)\b/i.test(q)) {
    return { text: 'Everything we’ve posted is on this page. Pick a keyword:', chips: KEYWORDS }
  }

  const qw = words(q)
  const scored = STAKYN_POSTS.map((p) => {
    const hay = [p.name, p.tagline, p.title, p.hook, p.keyword, ...p.keywords].join(' ').toLowerCase()
    const score = qw.reduce((n, w) => n + (hay.includes(w) ? (p.name.toLowerCase().includes(w) || p.keyword.toLowerCase() === w ? 3 : 1) : 0), 0)
    return { p, score }
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
  if (scored.length) {
    const best = scored.filter((x) => x.score >= scored[0].score - 1).slice(0, 2)
    return { text: best.length > 1 ? 'Two that fit:' : 'This should fix it:', posts: best.map((x) => x.p) }
  }
  return {
    text: 'Nothing on that yet. DM @stakynlabs and it might be tomorrow’s video. Or try one of these:',
    chips: KEYWORDS.slice(0, 6),
  }
}

function RepoCard({ p, onOpen }: { p: StakynPost; onOpen: () => void }) {
  const gh = p.links.find((l) => /github/i.test(l.label))?.url || p.repo || p.links[0]?.url
  return (
    <div className="mt-2 overflow-hidden rounded-xl border" style={{ background: K.raised, borderColor: K.line }}>
      <div className="px-3.5 pb-2 pt-3">
        <div className="text-[13px] font-bold text-white">
          {p.name}: <span className="font-medium text-white/75">{p.tagline}</span>
        </div>
        {p.facts.length > 0 && <div className="mt-0.5 text-[11px] text-white/50">{p.facts.join(' · ')}</div>}
        {p.steps.length > 0 && (
          <ol className="mt-2 space-y-1 text-[12px] leading-snug text-white/80">
            {p.steps.slice(0, 3).map((s, i) => (
              <li key={s} className="flex gap-1.5">
                <span className="font-bold" style={{ color: K.orange }}>
                  {i + 1}.
                </span>
                <span className="min-w-0 break-words">{s}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="grid grid-cols-2 border-t text-center text-[12px] font-bold" style={{ borderColor: K.line }}>
        {gh && (
          <a href={gh} target="_blank" rel="noreferrer" className="px-2 py-2.5 hover:bg-white/5" style={{ color: K.lime }}>
            {/github/i.test(gh) ? 'Open on GitHub ↗' : 'Open link ↗'}
          </a>
        )}
        <button type="button" onClick={onOpen} className={`border-l px-2 py-2.5 text-white hover:bg-white/5 ${gh ? '' : 'col-span-2'}`} style={{ borderColor: K.line }}>
          Full setup →
        </button>
      </div>
    </div>
  )
}

export function RepoChat({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 0,
      from: 'bot',
      text: 'Hey 👋 I’m Stakyn. Type the keyword from the reel (like GIT or TUNNEL) or tell me your problem, and I’ll send the repo and setup.',
      chips: [...KEYWORDS.slice(0, 5), 'Best repos'],
    },
  ])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const id = useRef(1)
  const scroller = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const timer = useRef(0)

  useEffect(() => {
    window.setTimeout(() => input.current?.focus(), 50)
    return () => window.clearTimeout(timer.current)
  }, [])
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  const ask = (text: string) => {
    const t = text.trim()
    if (!t || typing) return
    setMsgs((m) => [...m, { id: id.current++, from: 'me', text: t }])
    setTyping(true)
    timer.current = window.setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { id: id.current++, from: 'bot', ...answer(t) }])
    }, 650)
  }
  const send = (e: FormEvent) => {
    e.preventDefault()
    ask(draft)
    setDraft('')
  }
  const openPost = (p: StakynPost) => {
    onClose()
    navigate(`/stakyn/${p.slug}`)
  }

  return (
    <div
      role="dialog"
      aria-label="Stakyn, repo finder (demo chat)"
      className="msg-in flex h-[min(560px,calc(100dvh-7.5rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border text-white shadow-2xl"
      style={{ background: K.bg, borderColor: K.line }}
    >
      <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: K.line }}>
        <StakynLogo size={36} />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="text-sm font-semibold">Stakyn</div>
          <div className="truncate text-[11px] text-white/50">Repo finder · send the keyword from the reel</div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-lenis-prevent>
        {msgs.map((m) =>
          m.from === 'me' ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-md px-3.5 py-2 text-[13px] font-semibold text-[#0b0b0f]" style={{ background: K.lime }}>
                {m.text}
              </div>
            </div>
          ) : (
            <div key={m.id} className="msg-in max-w-[92%]">
              <div className="rounded-2xl rounded-bl-md px-3.5 py-2 text-[13px] leading-relaxed text-white/90" style={{ background: K.panel }}>
                {m.text}
              </div>
              {m.posts?.map((p) => (
                <RepoCard key={p.slug} p={p} onOpen={() => openPost(p)} />
              ))}
              {m.chips && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.chips.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => ask(c)}
                      className="rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold text-white/80 transition-colors hover:border-[#B7F23E] hover:text-white"
                      style={{ borderColor: K.line }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ),
        )}
        {typing && (
          <div className="flex w-14 items-center justify-center gap-1 rounded-2xl rounded-bl-md py-3" style={{ background: K.panel }} aria-label="Stakyn is typing">
            {[0, 1, 2].map((i) => (
              <span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-white/60" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
      </div>

      <form onSubmit={send} className="flex items-center gap-2 border-t px-3 py-2.5" style={{ borderColor: K.line }}>
        <input
          ref={input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Keyword or problem, e.g. GIT"
          aria-label="Keyword or problem"
          className="min-w-0 flex-1 rounded-lg border bg-transparent px-3 py-2 text-[13px] text-white outline-none placeholder:text-white/35 focus:border-[#B7F23E]"
          style={{ borderColor: K.line }}
        />
        <button
          type="submit"
          disabled={!draft.trim() || typing}
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#0b0b0f] transition-opacity disabled:opacity-40"
          style={{ background: K.lime }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </form>
      <div className="border-t px-4 py-1.5 text-center text-[10px] text-white/40" style={{ borderColor: K.line }}>
        Keyword replies for now · smarter answers coming soon
      </div>
    </div>
  )
}
