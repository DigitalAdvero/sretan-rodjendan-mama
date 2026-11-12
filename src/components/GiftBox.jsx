import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { ease, rand } from '../lib/motion'
import { HeartIcon, Sparkle } from './icons'

const BURST_COLORS = ['#E3C996', '#D6A6A8', '#F0E2C4', '#C29B5A', '#E6C1B8']

/** The glowing gift. When `opening` turns true the lid flies off and light pours out. */
export default function GiftBox({ opening, onOpen }) {
  const burst = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const angle = ((-90 + rand(-78, 78)) * Math.PI) / 180
        const distance = rand(90, 270)
        const heart = i % 3 === 0
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          heart,
          size: heart ? rand(10, 18) : rand(3, 6.5),
          duration: rand(1.2, 1.9),
          delay: 0.5 + rand(0, 0.25),
          color: BURST_COLORS[i % BURST_COLORS.length],
        }
      }),
    [],
  )

  return (
    <div className="relative my-9 h-[208px] w-[208px] sm:my-11 sm:h-[250px] sm:w-[250px]">
      {/* warm halo */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-[35%] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(236,206,148,0.55) 0%, rgba(243,214,206,0.38) 32%, rgba(252,247,242,0) 68%)',
        }}
        animate={opening ? { scale: [1, 1.5, 2.4], opacity: [0.9, 1, 0] } : { scale: [1, 1.07, 1], opacity: [0.7, 1, 0.7] }}
        transition={opening ? { duration: 1.7, ease: 'easeOut' } : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* light pouring out of the box */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[54%] left-[18%] h-[90%] w-[64%] origin-bottom"
        style={{
          background: 'linear-gradient(to top, rgba(255,240,208,0.95), rgba(255,240,208,0))',
          clipPath: 'polygon(32% 100%, 68% 100%, 100% 0, 0 0)',
          filter: 'blur(5px)',
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={opening ? { scaleY: [0, 1, 1.15], opacity: [0, 1, 0] } : { scaleY: 0, opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.42, ease }}
      />

      {/* twinkles around the gift */}
      {!opening && (
        <>
          <Sparkle className="absolute -left-3 top-[22%] h-4 w-4 text-gold motion-safe:animate-[twinkle_3s_ease-in-out_infinite]" />
          <Sparkle className="absolute right-[-6px] top-[8%] h-3 w-3 text-gold-light motion-safe:animate-[twinkle_3.6s_ease-in-out_0.8s_infinite]" />
          <Sparkle className="absolute bottom-[18%] right-[-14px] h-3.5 w-3.5 text-rose-light motion-safe:animate-[twinkle_4.2s_ease-in-out_1.6s_infinite]" />
        </>
      )}

      {/* the box itself (the button below is the accessible control) */}
      <motion.div
        role="presentation"
        onClick={onOpen}
        className={`relative h-full w-full ${opening ? '' : 'cursor-pointer'}`}
        animate={opening ? { rotate: [0, -3, 3, -2, 2, 0], y: 0 } : { y: [0, -9, 0] }}
        transition={opening ? { duration: 0.45, ease: 'easeInOut' } : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 220 230" className="h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="gift-box" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FBEFE8" />
              <stop offset="1" stopColor="#EACAC1" />
            </linearGradient>
            <linearGradient id="gift-lid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFF8F3" />
              <stop offset="1" stopColor="#F2D9D1" />
            </linearGradient>
            <linearGradient id="gift-shade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7A4A44" stopOpacity="0.1" />
              <stop offset="0.22" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="0.7" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="1" stopColor="#7A4A44" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="gift-ribbon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#B08139" />
              <stop offset="0.35" stopColor="#E7CB8E" />
              <stop offset="0.55" stopColor="#F7E8C2" />
              <stop offset="0.78" stopColor="#D2AB63" />
              <stop offset="1" stopColor="#A77A35" />
            </linearGradient>
            <linearGradient id="gift-bow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F5E4B8" />
              <stop offset="1" stopColor="#C29B5A" />
            </linearGradient>
            <radialGradient id="gift-shadow">
              <stop offset="0" stopColor="#8E5458" stopOpacity="0.3" />
              <stop offset="1" stopColor="#8E5458" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx="110" cy="216" rx="88" ry="11" fill="url(#gift-shadow)" />

          {/* base */}
          <rect x="42" y="104" width="136" height="106" rx="9" fill="url(#gift-box)" />
          <rect x="42" y="104" width="136" height="106" rx="9" fill="url(#gift-shade)" />
          <rect x="42" y="104" width="136" height="13" fill="#8E5458" opacity="0.08" />
          <rect x="101" y="104" width="18" height="106" fill="url(#gift-ribbon)" />
          <rect x="42.5" y="104.5" width="135" height="105" rx="8.5" fill="none" stroke="#C29B5A" strokeOpacity="0.35" />

          {/* lid + bow */}
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
            initial={false}
            animate={opening ? { x: 46, y: -150, rotate: 26, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={{ duration: 1.15, delay: 0.38, ease: [0.3, 0.7, 0.2, 1] }}
          >
            <rect x="34" y="82" width="152" height="28" rx="7" fill="url(#gift-lid)" />
            <rect x="34" y="82" width="152" height="28" rx="7" fill="url(#gift-shade)" />
            <rect x="34" y="104" width="152" height="6" rx="3" fill="#8E5458" opacity="0.08" />
            <rect x="101" y="82" width="18" height="28" fill="url(#gift-ribbon)" />
            <rect x="34.5" y="82.5" width="151" height="27" rx="6.5" fill="none" stroke="#C29B5A" strokeOpacity="0.35" />
            <path d="M110 84C96 64 70 56 66 70C62 84 92 90 110 84Z" fill="url(#gift-bow)" />
            <path d="M110 84C124 64 150 56 154 70C158 84 128 90 110 84Z" fill="url(#gift-bow)" />
            <path d="M108 84C98 72 80 66 76 72C74 78 92 84 108 84Z" fill="#A77A35" opacity="0.3" />
            <path d="M112 84C122 72 140 66 144 72C146 78 128 84 112 84Z" fill="#A77A35" opacity="0.3" />
            <path d="M106 86C100 94 94 104 88 112L96 110L99 117C104 106 108 96 110 88Z" fill="url(#gift-ribbon)" />
            <path d="M114 86C120 94 126 104 132 112L124 110L121 117C116 106 112 96 110 88Z" fill="url(#gift-ribbon)" />
            <ellipse cx="110" cy="84" rx="9" ry="7" fill="url(#gift-bow)" />
            <ellipse cx="107.5" cy="81.5" rx="3.6" ry="2.2" fill="#FFFFFF" opacity="0.55" />
          </motion.g>
        </svg>
      </motion.div>

      {/* golden dust and little hearts bursting out */}
      {opening && (
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[45%]">
          {burst.map((p, i) => (
            <motion.span
              key={i}
              className="absolute block"
              style={{ left: -p.size / 2, top: -p.size / 2, color: p.color }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={{ x: p.x, y: p.y, scale: [0, 1, 0.7], opacity: [0, 1, 0] }}
              transition={{ duration: p.duration, delay: p.delay, ease: [0.12, 0.8, 0.3, 1] }}
            >
              {p.heart ? (
                <HeartIcon style={{ width: p.size, height: p.size }} />
              ) : (
                <span
                  className="block rounded-full"
                  style={{ width: p.size, height: p.size, background: p.color, boxShadow: `0 0 10px 2px ${p.color}` }}
                />
              )}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  )
}
