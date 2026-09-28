import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenisInstance } from './lenis'

/** Wires up Lenis smooth scroll for the page. Call once at the app root. */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true })
    setLenisInstance(lenis)
    return () => {
      setLenisInstance(null)
      lenis.destroy()
    }
  }, [])
}
