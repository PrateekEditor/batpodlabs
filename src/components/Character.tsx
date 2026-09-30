import { useEffect, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { isMuted, subscribeMuted, toggleMuted, unlockAudio } from '../lib/audio'

/**
 * Hero illustration — a supplied reference photo (soft isometric / claymation
 * style desk scene) rather than a hand-drawn SVG. It's a single static
 * image, so the interactive bits from the previous illustration (the two
 * amplifier icons, the desk robot's random idea/note/coffee animation)
 * don't have anywhere to live pixel-for-pixel on it. The one piece of that
 * kept: tapping the little desk speaker in the photo still toggles the
 * site's mute, same as the header button — the ambient typing/background
 * sound itself is unchanged.
 */
export function Character() {
  const [muted, setMutedState] = useState(isMuted)
  useEffect(() => subscribeMuted(setMutedState), [])

  function handleSpeakerTap(e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) {
    unlockAudio()
    toggleMuted()
    e.currentTarget.blur()
  }

  return (
    <div className="character-float relative mx-auto w-full max-w-[460px] sm:max-w-[540px]">
      {/* soft glow blobs behind the scene */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[30%] -z-10 h-64 w-64 -translate-x-1/2 rounded-full opacity-40 blur-3xl sm:h-80 sm:w-80"
        style={{ background: 'radial-gradient(circle, #E8862D 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute right-[4%] top-[6%] -z-10 h-28 w-28 rounded-full opacity-30 blur-2xl"
        style={{ background: 'radial-gradient(circle, #2D7FF9 0%, transparent 70%)' }}
      />

      <div className="relative z-10">
        <picture>
          <source srcSet="/hero-desk.webp" type="image/webp" />
          <img
            src="/hero-desk.png"
            alt="Illustration of Prateek Patel at his desk, coding between two monitors"
            className="h-auto w-full select-none rounded-2xl"
            draggable={false}
          />
        </picture>

        {/* invisible hotspot over the desk speaker — tap to mute/unmute site sound */}
        <button
          type="button"
          onClick={handleSpeakerTap}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleSpeakerTap(e)
          }}
          aria-label={muted ? 'Unmute site sound' : 'Mute site sound'}
          className="absolute rounded-full outline-none focus-visible:ring-2 focus-visible:ring-amber"
          style={{ left: '63.8%', top: '58.7%', width: '9%', height: '10.5%' }}
        >
          {muted && (
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center rounded-full bg-navy/70"
            >
              <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none" stroke="#F2E9D8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
