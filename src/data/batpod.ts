/**
 * The biking side on /batpod. The bike is known; the gear list is yours to
 * fill: add one object per item and it shows up under "What I ride with".
 * `link` can be a brand page or an affiliate link; `code` a discount code.
 */
export const BATPOD_TAGLINE = 'Not chasing the destination. Chasing the RPM.'
export const BATPOD_BASES = ['Pune', 'Prayagraj', 'Nashik']

export const BATPOD_BIKE = {
  name: 'Batpod',
  model: 'Bajaj Dominar',
  blurb: 'The black Dominar behind every ride, motovlog and road trip on the channel.',
}

export type GearItem = {
  /** e.g. 'Helmet', 'Riding jacket', 'Camera', 'Intercom', 'Luggage' */
  kind: string
  name: string
  brand?: string
  note?: string
  link?: string
  code?: string
}

// TODO(Prateek): add the gear and brands you use, e.g.
// { kind: 'Camera', name: 'Your action cam', brand: 'Brand', link: 'https://…', code: 'BATPOD10' },
export const GEAR: GearItem[] = []
