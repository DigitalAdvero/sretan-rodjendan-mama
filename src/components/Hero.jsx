import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { hero } from '../content'
import { ease, easeInOut } from '../lib/motion'
import { photoUrl } from '../lib/photos'
import { scrollToTarget, useLenis } from '../lib/scroll'
import { HeartIcon, Sparkle } from './icons'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 1.3, ease } },
}

function TitleLine({ children, state, delay }) {
  return (
    <span className="block overflow-hidden pb-[0.1em] pt-[0.04em]">
      <motion.span
        className="block"
        initial="hidden"
        animate={state}
        variants={{ hidden: { y: '108%' }, show: { y: '0%' } }}
        transition={{ duration: 1.3, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function Portrait({ state }) {
  const [broken, setBroken] = useState(false)
  return (
    <motion.figure className="relative mx-auto w-[min(72vw,350px)] lg:w-[min(34vw,430px)]" initial="hidden" animate={state}>
      <motion.div
        aria-hidden="true"
        className="arch absolute -inset-3 border border-gold/50 sm:-inset-4"
        variants={{ hidden: { opacity: 0, scale: 0.97 }, show: { opacity: 1, scale: 1 } }}
        transition={{ duration: 1.6, ease, delay: 1.45 }}
      />
      <motion.div
        className="arch relative aspect-[4/5] overflow-hidden bg-blush shadow-[0_50px_90px_-45px_rgba(110,62,58,0.6)]"
        variants={{ hidden: { clipPath: 'inset(100% 0% 0% 0%)' }, show: { clipPath: 'inset(0% 0% 0% 0%)' } }}
        transition={{ duration: 1.8, ease: easeInOut, delay: 0.8 }}
      >
        {broken ? (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-blush-light to-blush-deep">
            <HeartIcon className="h-12 w-12 text-rose/70" />
          </div>
        ) : (
          <motion.img
            src={photoUrl(hero.photo)}
            alt={hero.photoAlt}
            onError={() => setBroken(true)}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: hero.photoFocus }}
            variants={{ hidden: { scale: 1.18 }, show: { scale: 1 } }}
            transition={{ duration: 2.8, ease, delay: 0.8 }}
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,240,225,0)_55%,rgba(120,70,60,0.2))]"
        />
      </motion.div>
      <Sparkle className="absolute -left-7 top-[16%] h-5 w-5 text-gold motion-safe:animate-[twinkle_3.2s_ease-in-out_infinite]" />
      <Sparkle className="absolute -right-6 top-[44%] h-3.5 w-3.5 text-gold-light motion-safe:animate-[twinkle_4s_ease-in-out_1s_infinite]" />
      <Sparkle className="absolute -left-4 bottom-[10%] h-3 w-3 text-rose-light motion-safe:animate-[twinkle_3.6s_ease-in-out_2s_infinite]" />
    </motion.figure>
  )
}

export default function Hero({ ready }) {
  const ref = useRef(null)
  const lenis = useLenis()
  const state = ready ? 'show' : 'hidden'
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 70])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 180])

  return (
    <section ref={ref} id="pocetak" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <motion.div aria-hidden="true" style={{ y: glowY }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[22%] -top-[12%] h-[75vmax] w-[75vmax] rounded-full bg-[radial-gradient(circle,rgba(243,214,206,0.85),rgba(243,214,206,0)_62%)]" />
        <div className="absolute -bottom-[30%] -left-[28%] h-[65vmax] w-[65vmax] rounded-full bg-[radial-gradient(circle,rgba(235,218,194,0.75),rgba(235,218,194,0)_60%)]" />
      </motion.div>

      <div className="hero-grid mx-auto w-full max-w-6xl flex-1 px-5 pb-12 pt-24 sm:px-8 lg:pb-8 lg:pt-16">
        <h1 className="hero-title font-serif text-[clamp(3.4rem,14vw,6.6rem)] font-medium leading-[0.96] tracking-[-0.01em] text-ink">
          {hero.title.map((line, i) => (
            <TitleLine key={line} state={state} delay={0.6 + i * 0.16}>
              {line}
              {i === hero.title.length - 1 && (
                <HeartIcon className="ml-[0.16em] inline-block h-[0.46em] w-[0.46em] -translate-y-[0.04em] text-rose" />
              )}
            </TitleLine>
          ))}
        </h1>

        <motion.div className="hero-photo" style={{ y: photoY }}>
          <Portrait state={state} />
        </motion.div>

        <motion.div
          className="hero-body"
          initial="hidden"
          animate={state}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2, delayChildren: 1.35 } } }}
        >
          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-[33ch] text-[1.1rem] font-light leading-relaxed text-ink-soft sm:text-[1.2rem] lg:mx-0"
          >
            {hero.text}
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-7 flex items-center justify-center gap-4 text-balance font-serif text-[1.6rem] font-medium italic leading-snug text-rose-deep sm:text-[1.85rem] lg:justify-start"
          >
            <span aria-hidden="true" className="hidden h-px w-12 shrink-0 bg-gradient-to-r from-transparent to-gold lg:block" />
            {hero.subtitle}
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        className="relative flex justify-center pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.2, delay: ready ? 2.6 : 0 }}
      >
        <button
          type="button"
          onClick={() => scrollToTarget(lenis, '#pismo')}
          className="flex flex-col items-center gap-3 text-ink-soft transition-colors duration-300 hover:text-rose-deep"
        >
          <span className="font-serif text-lg italic">{hero.scrollCue}</span>
          <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-gold/25">
            <span className="absolute inset-x-0 top-0 block h-1/3 bg-gold motion-safe:animate-[cue_2.4s_cubic-bezier(.65,0,.35,1)_infinite]" />
          </span>
        </button>
      </motion.div>
    </section>
  )
}
