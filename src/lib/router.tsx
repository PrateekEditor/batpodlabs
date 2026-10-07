import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { getLenis } from './lenis'

// Tiny History-API router — the site only has a couple of pages, so no library.
const EVENT = 'app:navigate'

function subscribe(cb: () => void) {
  window.addEventListener('popstate', cb)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener(EVENT, cb)
  }
}

export function usePath() {
  return useSyncExternalStore(subscribe, () => window.location.pathname, () => '/')
}

// The bot installs a guard so page changes can play its loading transition
// first; without one, navigation is immediate.
let guard: ((go: () => void) => void) | null = null
export function setNavigateGuard(g: ((go: () => void) => void) | null) {
  guard = g
}

export function navigate(to: string) {
  if (to === window.location.pathname) return
  if (guard) guard(() => go(to))
  else go(to)
}

function go(to: string) {
  window.history.pushState({}, '', to)
  window.dispatchEvent(new Event(EVENT))
  const lenis = getLenis()
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(0, { immediate: true, force: true })
  }
  window.scrollTo(0, 0)
}

export function Link({ to, onClick, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={to}
      {...rest}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        navigate(to)
      }}
    />
  )
}
