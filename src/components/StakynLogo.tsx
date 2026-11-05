import type { Ref } from 'react'

/**
 * The Stakyn Labs mark: three stacked orange layers with lime antennas,
 * inside an orange ring on a near-black disc. Drawn as SVG so it stays
 * crisp at any size. `ring={false}` drops the ring and disc for use on a
 * background of your own. The eyes blink now and then; pass `eyesRef` to
 * move them (set a `transform` attribute on it, e.g. translate(30 -8)).
 */
export function StakynLogo({
  size = 56,
  ring = true,
  className = '',
  eyesRef,
}: {
  size?: number
  ring?: boolean
  className?: string
  eyesRef?: Ref<SVGGElement>
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 1080 1080" className={className} aria-hidden>
      {ring && (
        <>
          <circle cx="540" cy="540" r="540" fill="#0b0b0f" />
          <circle cx="540" cy="540" r="486" fill="none" stroke="#E86A2F" strokeWidth="40" />
        </>
      )}
      {/* antennas */}
      <rect x="407" y="300" width="37" height="120" fill="#E86A2F" />
      <rect x="636" y="300" width="37" height="120" fill="#E86A2F" />
      <circle cx="425" cy="305" r="37" fill="#B7F23E" />
      <circle cx="654" cy="305" r="37" fill="#B7F23E" />
      {/* the three layers */}
      <rect x="311" y="411" width="458" height="115" rx="57.5" fill="#E86A2F" />
      <rect x="311" y="562" width="458" height="115" rx="57.5" fill="#E86A2F" />
      <rect x="311" y="714" width="458" height="115" rx="57.5" fill="#E86A2F" />
      {/* eyes: the outer group looks around, the inner one blinks */}
      <g ref={eyesRef} style={{ transition: 'transform 0.25s ease-out' }}>
        <g className="stakyn-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <rect x="434" y="579" width="65" height="82" rx="32.5" fill="#0b0b0f" />
          <rect x="581" y="579" width="65" height="82" rx="32.5" fill="#0b0b0f" />
        </g>
      </g>
    </svg>
  )
}
