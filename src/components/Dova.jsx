import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { dova } from '../content'
import { ease, seeded } from '../lib/motion'
import { Sparkle, withHearts } from './icons'

function Stars() {
  const { dots, sparkles } = useMemo(() => {
    const r = seeded(41)
    return {
      dots: Array.from({ length: 95 }, () => ({
        x: r() * 100,
        y: 20 + r() * 60,
        size: 0.8 + r() * 1.8,
        duration: 2.5 + r() * 5,
        delay: -r() * 7,
      })),
      sparkles: Array.from({ length: 7 }, () => ({
        x: 4 + r() * 92,
        y: 24 + r() * 52,
        size: 7 + r() * 8,
        duration: 3.5 + r() * 4,
        delay: -r() * 6,
      })),
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {dots.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[#FFF3D9] motion-safe:animate-[star-twinkle_4s_ease-in-out_infinite]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            boxShadow: s.size > 2 ? '0 0 6px rgba(255,236,196,0.85)' : undefined,
          }}
        />
      ))}
      {sparkles.map((s, i) => (
        <Sparkle
          key={i}
          className="absolute text-gold-light motion-safe:animate-[twinkle_5s_ease-in-out_infinite]"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}
        />
      ))}
      <span className="absolute right-[8%] top-[27%] block h-px w-28 bg-gradient-to-r from-[#FFF3D9] via-[#FFF3D9]/40 to-transparent opacity-0 motion-safe:animate-[shooting_13s_linear_4s_infinite]" />
    </div>
  )
}

function Crescent() {
  return (
    <motion.div
      className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 2.2, ease }}
    >
      <span
        aria-hidden="true"
        className="absolute -inset-[70%] rounded-full bg-[radial-gradient(circle,rgba(233,205,150,0.32),rgba(233,205,150,0)_62%)] motion-safe:animate-[glow-breathe_7s_ease-in-out_infinite]"
      />
      <svg viewBox="0 0 100 100" className="relative h-full w-full drop-shadow-[0_0_18px_rgba(233,205,150,0.55)]" aria-hidden="true">
        <defs>
          <linearGradient id="moon-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFF2D2" />
            <stop offset="1" stopColor="#D8B26C" />
          </linearGradient>
          <mask id="moon-cut">
            <rect width="100" height="100" fill="#fff" />
            <circle cx="63" cy="39" r="35" fill="#000" />
          </mask>
        </defs>
        <circle cx="47" cy="53" r="37" fill="url(#moon-gold)" mask="url(#moon-cut)" />
      </svg>
      <Sparkle className="absolute right-[2%] top-[30%] h-3 w-3 text-[#FFF2D2] motion-safe:animate-[twinkle_4s_ease-in-out_infinite]" />
    </motion.div>
  )
}

/** Text that lights up softly, like a star appearing. */
function Glow({ children, className = '', delay = 0 }) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, textShadow: '0 0 26px rgba(246,226,186,0.95)' }}
      whileInView={{ opacity: 1, textShadow: '0 0 0px rgba(246,226,186,0)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 2, ease, delay }}
    >
      {children}
    </motion.p>
  )
}

export default function Dova() {
  return (
    <section id="dova" className="dova-sky relative isolate overflow-hidden">
      <Stars />
      <div className="relative mx-auto max-w-[42rem] px-6 pb-[clamp(15rem,34vw,24rem)] pt-[clamp(15rem,34vw,24rem)] text-center">
        <Crescent />
        <Glow className="mt-10 text-balance font-serif text-[clamp(2.4rem,5.6vw,4rem)] font-medium leading-[1.08] text-[#F5EADB]">
          {dova.heading}
        </Glow>
        <span aria-hidden="true" className="mx-auto mt-7 block h-px w-24 bg-gradient-to-r from-transparent via-gold-light/70 to-transparent" />
        <div className="mt-12 space-y-8 font-serif text-[1.3rem] font-medium leading-[1.75] text-[#EADFD0] sm:text-[1.48rem]">
          {dova.paragraphs.map((paragraph, i) => (
            <Glow key={i}>{paragraph}</Glow>
          ))}
        </div>
        <Glow className="mt-14 font-script text-[clamp(2.7rem,6.5vw,3.8rem)] leading-[1.2] text-gold-light">
          {withHearts(dova.amin, 'text-[#F5EADB]')}
        </Glow>
      </div>
    </section>
  )
}
