/**
 * Original flat-vector illustration inspired by Prateek's own reference
 * photo (round sunglasses, black hoodie with a red speed-stripe chest
 * mark, light jeans, brown boots, a thigh pouch, hands tucked in the
 * kangaroo pocket). Hand-built from primitives — not a 3D model, not a
 * traced/reproduced photo — to keep the page instant-loading and give it
 * a bit of personality.
 */
export function Character() {
  return (
    <div className="character-float relative mx-auto w-full max-w-[360px] sm:max-w-[400px]">
      {/* soft glow blobs behind the figure */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[18%] -z-10 h-64 w-64 -translate-x-1/2 rounded-full opacity-40 blur-3xl sm:h-80 sm:w-80"
        style={{ background: 'radial-gradient(circle, #E8862D 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute right-[6%] top-[8%] -z-10 h-28 w-28 rounded-full opacity-30 blur-2xl"
        style={{ background: 'radial-gradient(circle, #2D7FF9 0%, transparent 70%)' }}
      />

      <svg viewBox="0 0 420 560" className="relative z-10 h-auto w-full" role="img" aria-label="Illustration of Prateek Patel">
        {/* speed lines, biker/motion cue */}
        <g className="speed-lines" stroke="#E8862D" strokeWidth="5" strokeLinecap="round" opacity="0.55">
          <line x1="8" y1="150" x2="58" y2="150" />
          <line x1="2" y1="172" x2="42" y2="172" />
          <line x1="12" y1="194" x2="52" y2="194" />
        </g>

        {/* ground shadow */}
        <ellipse cx="210" cy="538" rx="108" ry="14" fill="#0D1640" opacity="0.1" />

        {/* boots */}
        <path d="M148 470 h34 q10 0 10 10 v14 q0 8 -10 8 h-44 q-8 0 -6 -10 z" fill="#5B3A24" />
        <path d="M238 470 h34 q10 0 10 10 v14 q0 8 -10 8 h-44 q-8 0 -6 -10 z" fill="#5B3A24" />
        <rect x="148" y="466" width="36" height="10" rx="4" fill="#6E4A2E" />
        <rect x="238" y="466" width="36" height="10" rx="4" fill="#6E4A2E" />

        {/* legs (jeans) — start higher than the hoodie hem so the thigh reads clearly */}
        <path d="M168 300 q-4 92 -20 168 h34 q10 -78 20 -168 z" fill="#C2C6CF" />
        <path d="M248 300 q6 92 16 168 h-34 q-8 -78 -14 -168 z" fill="#C2C6CF" />
        <path d="M168 300 q-4 92 -20 168 h34 q10 -78 20 -168 z" fill="url(#jeansShade)" opacity="0.5" />

        {/* hoodie hood peeking behind neck */}
        <path d="M168 232 q42 -34 84 0 l-6 30 q-36 -22 -72 0 z" fill="#0F0F0F" />

        {/* torso / hoodie body — shorter hem so more leg shows, matching the reference photo's proportions */}
        <path
          d="M150 250
             q60 -34 120 0
             q26 14 28 60
             l-8 44
             q-8 20 -30 20
             h-96
             q-22 0 -30 -20
             l-8 -44
             q2 -46 28 -60 z"
          fill="#151515"
        />
        {/* kangaroo pocket */}
        <path d="M172 340 q38 -16 76 0 l-5 30 q-33 -13 -66 0 z" fill="#0B0B0B" opacity="0.6" />
        {/* drawstrings */}
        <line x1="198" y1="256" x2="194" y2="296" stroke="#3A3A3A" strokeWidth="3" strokeLinecap="round" />
        <line x1="222" y1="256" x2="226" y2="296" stroke="#3A3A3A" strokeWidth="3" strokeLinecap="round" />

        {/* red speed-stripe chest mark */}
        <g transform="translate(244 276) rotate(-18)">
          <rect width="34" height="6" rx="3" fill="#E4372B" />
          <rect y="10" width="26" height="6" rx="3" fill="#E4372B" />
          <rect y="20" width="18" height="6" rx="3" fill="#E4372B" />
        </g>

        {/* sleeves + hands tucked in pocket */}
        <path d="M150 256 q-30 8 -36 52 q-4 26 14 42 l16 -10 q-12 -30 6 -72 z" fill="#171717" />
        <path d="M270 256 q30 8 36 52 q4 26 -14 42 l-16 -10 q12 -30 -6 -72 z" fill="#171717" />
        {/* watch on left cuff */}
        <rect x="122" y="324" width="16" height="10" rx="2" fill="#1B1B1B" />

        {/* thigh pouch — sits over the jeans, below the hoodie hem, painted after the hoodie so it stays visible */}
        <g transform="translate(232 396) rotate(10)">
          <rect x="-22" y="-6" width="46" height="58" rx="11" fill="#161616" />
          <rect x="-22" y="12" width="46" height="7" fill="#E8862D" opacity="0.7" />
          <rect x="-13" y="-14" width="28" height="11" rx="5" fill="#2A2A2A" />
          <rect x="16" y="14" width="10" height="16" rx="3" fill="#0B0B0B" />
        </g>

        {/* neck */}
        <rect x="196" y="196" width="28" height="30" rx="10" fill="#D9A066" />

        {/* head */}
        <ellipse cx="210" cy="164" rx="46" ry="48" fill="#E3AD78" />
        {/* ears */}
        <ellipse cx="164" cy="168" rx="7" ry="10" fill="#E3AD78" />
        <ellipse cx="256" cy="168" rx="7" ry="10" fill="#E3AD78" />
        {/* hair */}
        <path d="M164 152 q4 -48 46 -48 q42 0 46 48 q-8 -14 -22 -16 q4 10 2 18 q-10 -16 -26 -16 q-16 0 -26 16 q-2 -8 2 -18 q-14 2 -22 16 z" fill="#14110F" />
        {/* light stubble */}
        <path d="M180 188 q30 22 60 0 q-4 18 -30 22 q-26 -4 -30 -22 z" fill="#14110F" opacity="0.12" />

        {/* sunglasses */}
        <g>
          <rect x="172" y="152" width="34" height="24" rx="12" fill="#151515" />
          <rect x="214" y="152" width="34" height="24" rx="12" fill="#151515" />
          <line x1="206" y1="160" x2="214" y2="160" stroke="#151515" strokeWidth="4" />
          <line x1="168" y1="158" x2="156" y2="154" stroke="#151515" strokeWidth="3" strokeLinecap="round" />
          <line x1="252" y1="158" x2="264" y2="154" stroke="#151515" strokeWidth="3" strokeLinecap="round" />
          <rect className="glint" x="180" y="157" width="9" height="5" rx="2" fill="#F2E9D8" opacity="0.85" />
          <rect className="glint" x="222" y="157" width="9" height="5" rx="2" fill="#F2E9D8" opacity="0.85" />
        </g>

        {/* smile */}
        <path d="M194 196 q16 14 32 0" stroke="#5B3A24" strokeWidth="3" strokeLinecap="round" fill="none" />

        <defs>
          <linearGradient id="jeansShade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8F94A0" />
            <stop offset="1" stopColor="#C2C6CF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
