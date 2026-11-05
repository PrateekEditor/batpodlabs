import { useEffect } from 'react'

/** Sets the tab title while a page is mounted. */
export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title
    return () => {
      document.title = prev
    }
  }, [title])
}
