import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'theme'

function read(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  // follow the OS setting until the visitor picks one themselves
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const onOs = (e: MediaQueryListEvent) => {
    try {
      if (localStorage.getItem(KEY)) return
    } catch {
      /* storage blocked — fall through and follow the OS */
    }
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
  }
  mq.addEventListener('change', onOs)
  return () => {
    mo.disconnect()
    mq.removeEventListener('change', onOs)
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'light' as Theme)
  const set = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* private mode — the choice just won't persist */
    }
  }, [])
  return { theme, set, toggle: () => set(theme === 'dark' ? 'light' : 'dark') }
}
