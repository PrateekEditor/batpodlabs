/**
 * Entries for the personal page. Add one object per ride or trip and they
 * show up on /journey, newest first. Leave the arrays empty and the page
 * shows a "coming soon" card.
 */
export type JourneyEntry = {
  title: string
  /** e.g. '2026-09-14' */
  date: string
  place: string
  /** rides only */
  distanceKm?: number
  note: string
  /** a path under /public, e.g. '/journey/ladakh.jpg' */
  image?: string
}

export const RIDES: JourneyEntry[] = []
export const TRAVEL: JourneyEntry[] = []
