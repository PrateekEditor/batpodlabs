import type { SocialKey } from '../data/links'

// Simple line glyphs, drawn on a 24-unit grid in the current text colour.
export function SocialIcon({ name, size = 18 }: { name: SocialKey; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'youtube':
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="4" />
          <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
        </svg>
      )
    case 'x':
      return (
        <svg {...common}>
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      )
    case 'reddit':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="14.5" rx="8" ry="5.5" />
          <path d="M12 9l1.4-5 4 1" />
          <circle cx="18.5" cy="5" r="1.4" />
          <circle cx="9" cy="14" r="0.8" fill="currentColor" />
          <circle cx="15" cy="14" r="0.8" fill="currentColor" />
          <path d="M9.5 17q2.5 1.4 5 0" />
        </svg>
      )
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M14 21v-8h3l.5-3.5H14V7.6c0-1 .4-1.6 1.7-1.6H18V3h-3c-3 0-4.5 1.8-4.5 4.4v2.1H7.5V13h3v8" />
        </svg>
      )
    case 'email':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
        </svg>
      )
  }
}
