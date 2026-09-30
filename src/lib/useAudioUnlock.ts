import { useEffect } from 'react'
import { unlockAudio } from './audio'

/** Browsers block audio until a user gesture — this arms a one-time
 * listener on the first click/tap/keypress anywhere on the page to start
 * the ambient typing loop (it stays silent if the visitor is muted). */
export function useAudioUnlock() {
  useEffect(() => {
    const unlock = () => {
      unlockAudio()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])
}
