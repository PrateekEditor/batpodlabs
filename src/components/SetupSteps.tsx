import { useState } from 'react'
import type { Step } from '../data/projects'
import { useReveal } from '../lib/useReveal'

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      window.setTimeout(() => setDone(false), 1400)
    } catch {
      /* clipboard can be blocked; the text is still selectable */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md bg-on-navy/10 px-2 py-1 text-[11px] font-semibold text-on-navy/80 transition-colors hover:bg-on-navy/20"
      aria-label="Copy command"
    >
      {done ? 'Copied' : 'Copy'}
    </button>
  )
}

function StepRow({ step, n, last }: { step: Step; n: number; last: boolean }) {
  const ref = useReveal<HTMLLIElement>()
  return (
    <li ref={ref} className="reveal relative flex gap-4 pb-8 last:pb-0">
      {!last && <span className="absolute left-[17px] top-10 h-[calc(100%-2.5rem)] w-px bg-ink/10" aria-hidden />}
      <span className="z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber text-sm font-bold text-on-amber">{n}</span>
      <div className="min-w-0 flex-1 pt-1">
        <h3 className="text-base font-semibold text-ink">{step.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
        {step.code && (
          <div className="mt-3 overflow-hidden rounded-xl bg-navy">
            <div className="flex items-center justify-between px-3 pt-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-on-navy/50">Terminal</span>
              <CopyButton text={step.code} />
            </div>
            <pre className="overflow-x-auto px-3 pb-3 pt-1.5 font-mono text-[12.5px] leading-relaxed text-on-navy">
              <code>{step.code}</code>
            </pre>
          </div>
        )}
      </div>
    </li>
  )
}

export function SetupSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="min-w-0">
      {steps.map((s, i) => (
        <StepRow key={s.title} step={s} n={i + 1} last={i === steps.length - 1} />
      ))}
    </ol>
  )
}
