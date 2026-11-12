import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { finale } from '../content'
import { ease, rand } from '../lib/motion'
import { useSound } from '../lib/sound'
import { HEART_PATH, HeartIcon, ReplayIcon } from './icons'

// Handwriting-style reveal: the text is uncovered from left to right.
const WRITE = {
  hidden: { clipPath: 'inset(-30% 100% -30% -5%)' },
  show: { clipPath: 'inset(-30% -5% -30% -5%)' },
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, ease, delay }}
    >
      {children}
    </motion.p>
  )
}

/** “Ti si voljena. Ti si važna. Ti si nezamjenjiva.” — one line at a time. */
function Trio() {
  return (
    <motion.div
      className="my-14 sm:my-20"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.6 } } }}
    >
      {finale.trio.map((line) => (
        <span key={line} className="block overflow-hidden pb-[0.08em] pt-[0.02em]">
          <motion.span
            className="block font-serif text-[clamp(2.7rem,8.6vw,5.2rem)] font-medium leading-[1.08] text-ink"
            variants={{
              hidden: { y: '110%', opacity: 0 },
              show: { y: '0%', opacity: 1, transition: { duration: 1.2, ease } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.div>
  )
}

function HeartBurst() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 13 }, (_, i) => ({
        x: rand(-130, 130),
        y: rand(-260, -120),
        size: rand(12, 26),
        rotate: rand(-35, 35),
        duration: rand(1.6, 2.4),
        color: ['#D6A6A8', '#B97A7F', '#E3C996', '#E6C1B8'][i % 4],
      })),
    [],
  )
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{ left: -h.size / 2, top: -h.size / 2, color: h.color }}
          initial={{ x: 0, y: 0, scale: 0.2, opacity: 0, rotate: 0 }}
          animate={{ x: h.x, y: h.y, scale: 1, opacity: [0, 1, 1, 0], rotate: h.rotate }}
          transition={{ duration: h.duration, ease: [0.16, 0.8, 0.3, 1], opacity: { duration: h.duration, times: [0, 0.12, 0.6, 1] } }}
        >
          <HeartIcon style={{ width: h.size, height: h.size }} />
        </motion.span>
      ))}
    </div>
  )
}

function BeatingHeart() {
  const { play } = useSound()
  const [bursts, setBursts] = useState([])
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const tap = () => {
    play('heart')
    const id = `${Date.now()}-${Math.random()}`
    setBursts((list) => [...list.slice(-3), id])
    timers.current.push(setTimeout(() => setBursts((list) => list.filter((b) => b !== id)), 2600))
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mt-8 grid h-44 w-44 place-items-center">
        <span
          aria-hidden="true"
          className="absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(214,166,168,0.6),rgba(214,166,168,0)_68%)] motion-safe:animate-[glow-breathe_1.4s_ease-in-out_infinite]"
        />
        <span aria-hidden="true" className="absolute inset-9 rounded-full border border-rose/30 motion-safe:animate-[pulse-ring_2.8s_ease-out_infinite]" />
        <span aria-hidden="true" className="absolute inset-9 rounded-full border border-gold/30 motion-safe:animate-[pulse-ring_2.8s_ease-out_1.4s_infinite]" />
        <button
          type="button"
          onClick={tap}
          aria-label={finale.heartLabel}
          className="relative h-24 w-24 rounded-full motion-safe:animate-[heartbeat_1.4s_ease-in-out_infinite]"
        >
          <svg viewBox="0 0 24 24" className="h-full w-full drop-shadow-[0_14px_22px_rgba(142,84,88,0.45)]" aria-hidden="true">
            <defs>
              <linearGradient id="beating-heart" x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0" stopColor="#E2A9AB" />
                <stop offset="0.55" stopColor="#B4666D" />
                <stop offset="1" stopColor="#8A4B53" />
              </linearGradient>
            </defs>
            <path d={HEART_PATH} fill="url(#beating-heart)" />
            <path d="M6.6 6.6c-1.5.3-2.5 1.7-2.3 3.3" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="0.9" strokeLinecap="round" />
          </svg>
        </button>
        <AnimatePresence>
          {bursts.map((id) => (
            <HeartBurst key={id} />
          ))}
        </AnimatePresence>
      </div>
      <p className="mt-1 font-serif text-[1.05rem] italic text-ink-faint">{finale.heartHint}</p>
    </div>
  )
}

export default function Finale({ onReplay }) {
  return (
    <section id="kraj" className="relative isolate overflow-hidden px-6 pt-16 md:pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[75%] bg-[radial-gradient(70%_60%_at_50%_100%,rgba(243,214,206,0.85),rgba(240,222,190,0.35)_45%,rgba(252,247,242,0)_75%)]"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal className="font-serif text-[clamp(2rem,4.8vw,3.1rem)] font-medium italic leading-tight text-rose-deep">{finale.lead}</Reveal>
        <Reveal className="mx-auto mt-8 max-w-xl text-pretty text-[1.12rem] font-light leading-relaxed text-ink-soft sm:text-[1.22rem]">
          {finale.intro}
        </Reveal>

        <Trio />

        <Reveal className="mx-auto max-w-xl text-pretty text-[1.12rem] font-light leading-relaxed text-ink-soft sm:text-[1.22rem]">
          {finale.after[0]}
        </Reveal>
        <Reveal className="mx-auto mt-6 max-w-xl text-pretty text-[1.12rem] font-light leading-relaxed text-ink-soft sm:text-[1.22rem]">
          {finale.after[1]}
        </Reveal>

        <motion.div className="mt-20 sm:mt-24" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
          {/* The trigger sits on this unclipped wrapper: a clipped element never counts as "in view". */}
          <motion.p
            className="font-script text-[clamp(3.3rem,10vw,5.6rem)] leading-[1.15] text-rose-deep"
            variants={WRITE}
            transition={{ duration: 2.4, ease: [0.45, 0, 0.25, 1] }}
          >
            {finale.end}
          </motion.p>
          <BeatingHeart />
        </motion.div>

        <button
          type="button"
          onClick={onReplay}
          className="mt-16 inline-flex items-center gap-2.5 rounded-full border border-gold/50 bg-white/40 px-6 py-3 text-[0.95rem] tracking-[0.02em] text-ink-soft transition-colors duration-300 hover:bg-white/80 hover:text-ink"
        >
          <ReplayIcon className="h-4 w-4" />
          {finale.replay}
        </button>
      </div>

      <footer className="relative mx-auto mt-24 max-w-3xl border-t border-gold/25 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-8 text-center">
        <p className="inline-flex items-center gap-2 font-serif text-[1.15rem] italic text-ink-soft">
          {finale.footer}
          <HeartIcon className="h-3.5 w-3.5 text-rose" />
        </p>
      </footer>
    </section>
  )
}
