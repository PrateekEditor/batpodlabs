export function ProjectIcon({ kind, size = 22 }: { kind: 'xray' | 'pipeline' | 'cube'; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const
  if (kind === 'xray')
    return (
      <svg {...p}>
        <path d="M12 3l9 5-9 5-9-5 9-5z" />
        <path d="M3 12.5l9 5 9-5" />
        <path d="M3 17l9 5 9-5" opacity="0.5" />
      </svg>
    )
  if (kind === 'pipeline')
    return (
      <svg {...p}>
        <circle cx="5" cy="6" r="2.2" />
        <circle cx="5" cy="18" r="2.2" />
        <circle cx="19" cy="12" r="2.2" />
        <path d="M5 8.2v7.6M7.2 6H12a3 3 0 0 1 3 3v0M7.2 18H12a3 3 0 0 0 3-3v0M15 12h1.8" />
      </svg>
    )
  return (
    <svg {...p}>
      <path d="M12 2.5l8.5 4.7v9.6L12 21.5l-8.5-4.7V7.2L12 2.5z" />
      <path d="M12 12l8.5-4.8M12 12L3.5 7.2M12 12v9.5" />
    </svg>
  )
}
