import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { surprises } from '../content'
import { ease, rand } from '../lib/motion'
import { useSound } from '../lib/sound'
import { EmblemFlower, EmblemHeart, EmblemStar, HeartIcon, Sparkle } from './icons'

const EMBLEMS = { heart: EmblemHeart, star: EmblemStar, flower: EmblemFlower }

// Each card is a slightly different paper, laid on the table at its own angle.
const PAPERS = [
  { background: 'linear-gradient(160deg, #FFFAF4 0%, #F6E7D8 100%)', tilt: -2.6 },
  { background: 'linear-gradient(160deg, #FFF7F4 0%, #F4DFD8 100%)', tilt: 1.9 },
  { background: 'linear-gradient(160deg, #FFFBF2 0%, #F2E4CB 100%)', tilt: -1.3 },
]

function SparkBurst() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2 + rand(-0.18, 0.18)
        const distance = rand(120, 210)
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance * 0.85,
          size: rand(8, 15),
          delay: rand(0, 0.12),
          heart: i % 4 === 0,
          color: ['#E3C996', '#D6A6A8', '#C29B5A', '#F0E2C4'][i % 4],
        }
      }),
    [],
  )
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-0 w-0">
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{ left: -s.size / 2, top: -s.size / 2, color: s.color, width: s.size, height: s.size }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{ x: s.x, y: s.y, scale: [0, 1, 0.6], opacity: [0, 1, 0], rotate: rand(-60, 60) }}
          transition={{ duration: 1.3, delay: 0.25 + s.delay, ease: [0.12, 0.8, 0.3, 1] }}
        >
          {s.heart ? <HeartIcon className="h-full w-full" /> : <Sparkle className="h-full w-full" />}
        </motion.span>
      ))}
    </div>
  )
}

function NoteCard({ card, index }) {
  const [open, setOpen] = useState(false)
  const [bursts, setBursts] = useState(0)
  const { play } = useSound()
  const Emblem = EMBLEMS[card.icon] ?? EmblemHeart
  const paper = PAPERS[index % PAPERS.length]

  const toggle = () => {
    if (!open) {
      setBursts((b) => b + 1)
      play('flip')
    } else {
      play('close')
    }
    setOpen((o) => !o)
  }

  return (
    <motion.div
      className="relative w-full max-w-[340px]"
      style={{ perspective: 1600 }}
      initial={{ opacity: 0, y: 44, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: paper.tilt }}
      whileHover={{ rotate: 0, y: -4, transition: { duration: 0.5, ease } }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.2, ease, delay: index * 0.14 }}
    >
      <motion.button
        type="button"
        onClick={toggle}
        aria-pressed={open}
        aria-label={open ? `${card.title} ${card.message}` : `${card.title} – ${surprises.openHint}`}
        className="preserve-3d relative block aspect-[4/5] w-full rounded-[18px] text-center"
        initial={false}
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 55, damping: 12, mass: 0.9 }}
      >
        {/* front */}
        <span
          aria-hidden={open}
          className="backface-hidden absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[18px] px-8 shadow-[0_34px_60px_-36px_rgba(90,55,45,0.6),0_8px_18px_-12px_rgba(90,55,45,0.25)]"
          style={{ background: paper.background, transform: 'rotateY(0deg)' }}
        >
          <span aria-hidden="true" className="absolute inset-[10px] rounded-[12px] border border-gold/40" />
          <span aria-hidden="true" className="absolute inset-[14px] rounded-[10px] border border-gold/20" />
          <span className="grid h-[4.6rem] w-[4.6rem] place-items-center rounded-full border border-gold/45 bg-white/40">
            <Emblem className="h-11 w-11 text-rose-deep" />
          </span>
          <span className="mt-7 block font-serif text-[2.05rem] font-semibold leading-[1.1] text-ink">{card.title}</span>
          <span aria-hidden="true" className="mt-5 block h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <span className="mt-5 inline-flex items-center gap-2 text-[0.95rem] font-light tracking-[0.02em] text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-rose motion-safe:animate-[twinkle_2s_ease-in-out_infinite]" />
            {surprises.openHint}
          </span>
        </span>

        {/* back */}
        <span
          aria-hidden={!open}
          className="backface-hidden absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[18px] px-7 shadow-[0_34px_60px_-36px_rgba(90,55,45,0.7)] sm:px-8"
          style={{ background: 'linear-gradient(160deg, #BC8387 0%, #9F646A 55%, #8B535A 100%)', transform: 'rotateY(180deg)' }}
        >
          <span aria-hidden="true" className="absolute inset-[10px] rounded-[12px] border border-gold-light/40" />
          <HeartIcon outline strokeWidth={1.2} className="h-7 w-7 text-gold-light" />
          <span className="mt-5 block text-balance font-serif text-[1.36rem] font-medium italic leading-[1.5] text-[#FFF5EC] lg:text-[1.3rem]">
            {card.message}
          </span>
          <span className="mt-6 block text-[0.85rem] font-light tracking-[0.02em] text-[#FFF5EC]/70">{surprises.closeHint}</span>
        </span>
      </motion.button>

      {bursts > 0 && <SparkBurst key={bursts} />}
    </motion.div>
  )
}

export default function Surprises() {
  return (
    <section id="iznenadjenja" className="relative isolate overflow-hidden px-5 py-24 sm:px-8 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_60%,rgba(243,220,214,0.6),rgba(252,247,242,0)_70%)]"
      />
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease }}
      >
        <h2 className="font-serif text-[clamp(2.4rem,5.6vw,4.1rem)] font-medium leading-[1.05] text-ink">{surprises.heading}</h2>
        <p className="mt-5 text-[1.1rem] font-light leading-relaxed text-ink-soft sm:text-[1.18rem]">{surprises.subtitle}</p>
      </motion.div>

      <div className="mx-auto mt-16 grid max-w-6xl justify-items-center gap-12 lg:mt-20 lg:grid-cols-3 lg:gap-10">
        {surprises.cards.map((card, i) => (
          <NoteCard key={card.title} card={card} index={i} />
        ))}
      </div>
    </section>
  )
}
