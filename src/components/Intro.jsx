import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { intro, ui } from '../content'
import { ease, rand } from '../lib/motion'
import { useScrollLock } from '../lib/scroll'
import { useSound } from '../lib/sound'
import GiftBox from './GiftBox'
import { HeartIcon, Sprig } from './icons'

const LEAD_START = 0.35
const LEAD_STEP = 0.1
const MESSAGE_GAP = 0.5
const MESSAGE_STEP = 0.055

function Word({ children, delay }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.span>
  )
}

function Words({ text, start, step }) {
  const words = text.split(' ')
  return words.map((word, i) => (
    <Fragment key={i}>
      <Word delay={start + i * step}>{word}</Word>
      {i < words.length - 1 ? ' ' : null}
    </Fragment>
  ))
}

function RisingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: rand(3, 95),
        size: rand(10, 24),
        duration: rand(8, 13),
        delay: rand(0, 6),
        drift: rand(-40, 40),
        color: ['#D6A6A8', '#E3C996', '#E6C1B8', '#C9969A'][i % 4],
      })),
    [],
  )
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          className="absolute -bottom-10 block"
          style={{ left: `${h.left}%`, color: h.color }}
          initial={{ y: '0vh', x: 0, opacity: 0 }}
          animate={{ y: '-118vh', x: h.drift, opacity: [0, 0.7, 0.7, 0] }}
          transition={{
            y: { duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: h.duration, delay: h.delay, repeat: Infinity, times: [0, 0.15, 0.7, 1] },
          }}
        >
          <HeartIcon style={{ width: h.size, height: h.size }} />
        </motion.span>
      ))}
    </div>
  )
}

export default function Intro({ onFinish }) {
  const [stage, setStage] = useState('idle') // idle → opening → message
  const [canContinue, setCanContinue] = useState(false)
  const { play } = useSound()
  useScrollLock(true)

  const leadCount = intro.messageLead.split(' ').length
  const messageStart = LEAD_START + leadCount * LEAD_STEP + MESSAGE_GAP
  const messageEnd = messageStart + intro.message.split(' ').length * MESSAGE_STEP + 1

  const open = () => {
    if (stage !== 'idle') return
    setStage('opening')
    play('open')
  }

  useEffect(() => {
    if (stage === 'opening') {
      const t = setTimeout(() => {
        setStage('message')
        play('reveal')
      }, 1650)
      return () => clearTimeout(t)
    }
    if (stage === 'message') {
      const t = setTimeout(() => setCanContinue(true), (messageEnd + 0.6) * 1000)
      return () => clearTimeout(t)
    }
    return undefined
  }, [stage, messageEnd, play])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={ui.gift}
      className="fixed inset-0 z-[60] touch-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.3, ease: [0.4, 0, 0.2, 1] } }}
      transition={{ duration: 0.8 }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(130% 95% at 50% 42%, #FFFBF7 0%, #FBF1EA 46%, #F0D9D1 100%)' }}
      />

      {/* the glow that blooms when the gift opens */}
      <div aria-hidden="true" className="absolute left-1/2 top-[47%] h-0 w-0">
        <motion.div
          className="absolute -left-[75vmax] -top-[75vmax] h-[150vmax] w-[150vmax] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,242,216,0.95) 0%, rgba(248,226,206,0.6) 22%, rgba(243,220,214,0) 54%)',
          }}
          initial={{ scale: 0.12, opacity: 0 }}
          animate={stage === 'idle' ? { scale: 0.12, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 1.9, ease, delay: stage === 'opening' ? 0.4 : 0 }}
        />
      </div>

      <Sprig className="pointer-events-none absolute -left-8 -top-6 h-40 w-40 text-gold/55 sm:-left-6 sm:h-56 sm:w-56" />
      <Sprig className="pointer-events-none absolute -bottom-6 -right-8 h-40 w-40 rotate-180 text-gold/55 sm:-right-6 sm:h-56 sm:w-56" />

      <AnimatePresence mode="wait">
        {stage !== 'message' ? (
          <motion.div
            key="gift"
            className="relative flex h-full flex-col items-center justify-center px-6 pb-4 text-center"
            exit={{ opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.6 } }}
          >
            <motion.p
              className="font-serif text-[clamp(2.15rem,7.2vw,3.8rem)] font-medium italic leading-[1.08] text-ink"
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.6, ease, delay: 0.35 }}
            >
              {intro.line1}
            </motion.p>
            <motion.p
              className="mt-4 max-w-[22rem] text-[1.02rem] font-light leading-relaxed text-ink-soft sm:max-w-none sm:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease, delay: 1.05 }}
            >
              {intro.line2}
            </motion.p>

            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease, delay: 0.6 }}>
              <GiftBox opening={stage === 'opening'} onOpen={open} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={
                stage === 'opening'
                  ? { opacity: 0, y: 8, scale: 0.92, transition: { duration: 0.35 } }
                  : { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease, delay: 1.7 } }
              }
            >
              <div className="motion-safe:animate-[float-y_3.8s_ease-in-out_infinite]">
                <span className="relative inline-flex">
                  <span aria-hidden="true" className="absolute inset-0 rounded-full bg-rose/35 motion-safe:animate-[pulse-ring_2.6s_ease-out_infinite]" />
                  <span aria-hidden="true" className="absolute inset-0 rounded-full bg-gold/30 motion-safe:animate-[pulse-ring_2.6s_ease-out_1.3s_infinite]" />
                  <button
                    type="button"
                    onClick={open}
                    disabled={stage !== 'idle'}
                    className="relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-br from-[#C98F93] via-[#B37378] to-[#995C62] px-9 py-[1.05rem] text-[1.06rem] font-medium tracking-[0.02em] text-[#FFF8F2] shadow-[0_20px_40px_-18px_rgba(142,84,88,0.8)] ring-1 ring-inset ring-white/25 transition-[filter] duration-300 hover:brightness-105"
                  >
                    {intro.button}
                    <HeartIcon className="h-[1.05em] w-[1.05em] motion-safe:animate-[heartbeat_1.6s_ease-in-out_infinite]" />
                  </button>
                </span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            className="relative flex h-full flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <RisingHearts />
            <p className="relative text-balance font-serif text-[clamp(2.3rem,7.4vw,4rem)] font-medium italic leading-[1.1] text-rose-deep">
              <Words text={intro.messageLead} start={LEAD_START} step={LEAD_STEP} />
            </p>
            <p className="relative mt-6 max-w-[34rem] text-balance font-serif text-[clamp(1.4rem,3.7vw,1.95rem)] font-medium leading-[1.5] text-ink">
              <Words text={intro.message} start={messageStart} step={MESSAGE_STEP} />
            </p>
            <div className="relative mt-12 flex h-16 items-center justify-center">
              <AnimatePresence>
                {canContinue && (
                  <motion.button
                    type="button"
                    onClick={onFinish}
                    className="inline-flex items-center gap-2.5 rounded-full border border-gold/60 bg-white/55 px-8 py-[0.95rem] text-[1.02rem] tracking-[0.01em] text-ink shadow-[0_16px_34px_-20px_rgba(110,70,55,0.6)] backdrop-blur transition-colors duration-300 hover:bg-white/85"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease }}
                  >
                    {intro.next}
                    <HeartIcon className="h-4 w-4 text-rose" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
