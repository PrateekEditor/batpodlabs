import { useEffect, useState } from 'react'
import { isMuted, subscribeMuted, toggleMuted, unlockAudio } from '../lib/audio'

export function MuteButton() {
  const [muted, setMutedState] = useState(isMuted)

  useEffect(() => subscribeMuted(setMutedState), [])

  return (
    <button
      type="button"
      aria-label={muted ? 'Unmute site sound' : 'Mute site sound'}
      aria-pressed={muted}
      onClick={() => {
        unlockAudio()
        toggleMuted()
      }}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy/15 text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-amber hover:text-amber-text active:translate-y-0 active:scale-95 motion-reduce:transition-none sm:h-10 sm:w-10"
    >
      {muted ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      )}
    </button>
  )
}
