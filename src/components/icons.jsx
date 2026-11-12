import { Fragment } from 'react'

export const HEART_PATH =
  'M12 20.5s-7.5-4.6-9.3-9.6C1.5 7.6 3.6 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.3 0 5.4 3.1 4.2 6.4-1.8 5-9.3 9.6-9.3 9.6z'

export const SPARKLE_PATH = 'M12 0C12.7 6.6 17.4 11.3 24 12 17.4 12.7 12.7 17.4 12 24 11.3 17.4 6.6 12.7 0 12 6.6 11.3 11.3 6.6 12 0Z'

export function HeartIcon({ outline = false, strokeWidth = 1.4, className = '', style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" focusable="false">
      <path
        d={HEART_PATH}
        fill={outline ? 'none' : 'currentColor'}
        stroke={outline ? 'currentColor' : 'none'}
        strokeWidth={outline ? strokeWidth : 0}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Sparkle({ className = '', style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" focusable="false">
      <path d={SPARKLE_PATH} fill="currentColor" />
    </svg>
  )
}

/** Turns ❤️ / ❤ / 🤍 inside a sentence into drawn hearts that match the palette. */
export function withHearts(text, className = 'text-rose') {
  const parts = text.replace(/ (❤️|❤|🤍)/gu, ' $1').split(/(❤️|❤|🤍)/u)
  return parts.map((part, i) => {
    if (part === '❤️' || part === '❤')
      return (
        <HeartIcon key={i} className={`inline-block h-[0.62em] w-[0.62em] -translate-y-[0.02em] align-baseline ${className}`} />
      )
    if (part === '🤍')
      return (
        <HeartIcon
          key={i}
          outline
          strokeWidth={1.6}
          className="inline-block h-[0.62em] w-[0.62em] -translate-y-[0.02em] align-baseline"
        />
      )
    return <Fragment key={i}>{part}</Fragment>
  })
}

/* ───────────── Botanical line art ───────────── */

function cubic(p0, p1, p2, p3, t) {
  const u = 1 - t
  return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k])
}

function cubicAngle(p0, p1, p2, p3, t) {
  const u = 1 - t
  const d = [0, 1].map(
    (k) => 3 * u * u * (p1[k] - p0[k]) + 6 * u * t * (p2[k] - p1[k]) + 3 * t * t * (p3[k] - p2[k]),
  )
  return (Math.atan2(d[1], d[0]) * 180) / Math.PI
}

const leaf = (len, wid) =>
  `M0 0C${len * 0.3} ${-wid} ${len * 0.72} ${-wid} ${len} 0C${len * 0.72} ${wid} ${len * 0.3} ${wid} 0 0Z`

const STEM = [
  [10, 190],
  [42, 150],
  [64, 78],
  [146, 26],
]
const SIDE_STEM = [
  [52, 128],
  [70, 112],
  [92, 106],
  [116, 108],
]

const LEAVES = [0.14, 0.25, 0.36, 0.47, 0.58, 0.68, 0.78].map((t, i) => {
  const [x, y] = cubic(...STEM, t)
  const side = i % 2 === 0 ? 1 : -1
  const len = 24 - i * 1.8
  return { x, y, rot: cubicAngle(...STEM, t) + side * 46, len, wid: len * 0.3 }
})

function Flower({ x, y, r, rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy={-r * 0.95}
          rx={r * 0.62}
          ry={r * 0.9}
          transform={`rotate(${a})`}
          fill="#F3DCD6"
          fillOpacity="0.9"
          stroke="currentColor"
          strokeWidth="0.9"
        />
      ))}
      <circle r={r * 0.36} fill="#E3C996" stroke="currentColor" strokeWidth="0.7" />
    </g>
  )
}

/** A thin golden sprig with leaves and two small blossoms. */
export function Sprig({ className = '', style }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} fill="none" aria-hidden="true" focusable="false">
      <path d={`M${STEM[0]}C${STEM[1]} ${STEM[2]} ${STEM[3]}`} stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path
        d={`M${SIDE_STEM[0]}C${SIDE_STEM[1]} ${SIDE_STEM[2]} ${SIDE_STEM[3]}`}
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      {LEAVES.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
          <path d={leaf(l.len, l.wid)} fill="currentColor" fillOpacity="0.13" stroke="currentColor" strokeWidth="0.9" />
          <path d={`M1.5 0L${l.len * 0.82} 0`} stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.7" />
        </g>
      ))}
      <g transform="translate(116 108) rotate(-8)">
        <path d={leaf(15, 4.6)} fill="currentColor" fillOpacity="0.13" stroke="currentColor" strokeWidth="0.8" />
      </g>
      <Flower x={148} y={25} r={9} rotate={12} />
      <Flower x={119} y={108} r={6.5} rotate={-20} />
      <circle cx="132" cy="40" r="2.6" fill="#F3DCD6" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  )
}

/** Five-petal forget-me-not (“nezaboravak”). */
export function Blossom({ className = '', style }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} fill="none" aria-hidden="true" focusable="false">
      <Flower x={20} y={20} r={8.5} />
    </svg>
  )
}

/* ───────────── Card emblems ───────────── */

export function EmblemHeart({ className = '' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true" focusable="false">
      <g transform="translate(6 7) scale(1.5)">
        <path d={HEART_PATH} stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
      </g>
      <path d={SPARKLE_PATH} fill="#C29B5A" transform="translate(33 6) scale(0.42)" />
    </svg>
  )
}

export function EmblemStar({ className = '' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true" focusable="false">
      <path d={SPARKLE_PATH} fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="0.8" transform="translate(12 10) scale(1.15)" />
      <path d={SPARKLE_PATH} fill="#C29B5A" transform="translate(6 32) scale(0.36)" />
      <path d={SPARKLE_PATH} fill="#C29B5A" transform="translate(36 6) scale(0.3)" />
      <path d="M4 44c6-4 11-6.5 17-8" stroke="#C29B5A" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="1 3" />
    </svg>
  )
}

export function EmblemFlower({ className = '' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true" focusable="false">
      <path d="M24 30C23 37 21 41 17 45" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <g transform="translate(19 39) rotate(-130)">
        <path d={leaf(9, 3)} fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="0.8" />
      </g>
      <Flower x={24} y={20} r={8} />
    </svg>
  )
}

/* ───────────── UI icons ───────────── */

export function SpeakerIcon({ on, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
      {on ? (
        <>
          <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
          <path d="M18 6.8a7.4 7.4 0 0 1 0 10.4" />
        </>
      ) : (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      )}
    </svg>
  )
}

export function CloseIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function ChevronIcon({ direction = 'right', className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'right' ? 'M9.5 5l7 7-7 7' : 'M14.5 5l-7 7 7 7'} />
    </svg>
  )
}

export function ReplayIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4.5 4.5v3.6h3.6" />
    </svg>
  )
}
