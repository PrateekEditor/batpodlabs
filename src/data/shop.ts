/**
 * The Stakyn Labs 3D print shop on /shop, taken from the Product Board.
 * Prices aren't set yet, so every piece is "DM for price". When a product
 * reaches Ready to sell, set `status: 'ready'` and add a `price` (in rupees).
 * Only list prints whose licence allows selling, or your own designs.
 */
export type ShopStatus = 'ready' | 'testing' | 'soon'

export type ShopCategory = { id: string; name: string; blurb: string; icon: string }

// icon = an SVG path on a 24-unit grid
export const SHOP_CATEGORIES: ShopCategory[] = [
  { id: 'de', name: 'Daily essentials', blurb: 'Everyday helpers like hooks, clips and phone stands.', icon: 'M7 3h10v18H7zM10 18h4' },
  { id: 'hg', name: 'Home games', blurb: 'Games the family can play together, and things that go with them.', icon: 'M4 4h16v16H4zM9 9h.01M15 15h.01M15 9h.01M9 15h.01' },
  { id: 'hw', name: 'Hot Wheels props', blurb: 'Diorama pieces for small cars: mechanics, petrol pumps and more.', icon: 'M3 15h18M5 15l2-5h10l2 5M7 18a1.5 1.5 0 1 0 0-.01M17 18a1.5 1.5 0 1 0 0-.01' },
  { id: 'bk', name: 'Bike accessories', blurb: "Replacement parts welding shops can't easily make.", icon: 'M5.5 17a3.5 3.5 0 1 0 0-.01M18.5 17a3.5 3.5 0 1 0 0-.01M5.5 17L9 9h6l3.5 8M9 9L7.5 6H5' },
]

export type ShopProduct = { key: string; name: string; category: string; status: ShopStatus; note?: string; price?: number }

export const SHOP_PRODUCTS: ShopProduct[] = [
  { key: 'DE-3', name: 'Skeleton phone stand', category: 'de', status: 'testing', note: 'Final colours being picked.' },
  { key: 'DE-1', name: 'Auto-locking towel hook', category: 'de', status: 'testing', note: 'Gravity lock, ribbed finish.' },
  { key: 'HG-1', name: 'Custom card box', category: 'hg', status: 'testing', note: 'Sized to your deck.' },
  { key: 'HG-2', name: 'Flexi Rex', category: 'hg', status: 'testing', note: 'Print-in-place dino with stronger links.' },
  { key: 'HW-1', name: 'Garage essentials diorama set', category: 'hw', status: 'testing' },
  { key: 'HW-2', name: 'Petrol pump', category: 'hw', status: 'soon' },
  { key: 'BK-1', name: 'Fog lamp clamp', category: 'bk', status: 'soon', note: 'Printed in PETG or ASA so it survives sun and engine heat.' },
]

export const SHOP_PRINTER = 'Bambu Lab A1'
