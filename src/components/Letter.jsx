import { motion, useReducedMotion } from 'framer-motion'
import { letter } from '../content'
import { ease } from '../lib/motion'
import { Blossom, Sprig, withHearts } from './icons'

const MASK = 'linear-gradient(180deg, #000 var(--ink), transparent calc(var(--ink) + 30%))'

/** Text that appears top-to-bottom, as if the ink were still settling on the page. */
function Ink({ children, className = '', delay = 0, duration = 1.7 }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      style={{ WebkitMaskImage: MASK, maskImage: MASK }}
      initial={{ '--ink': '-30%' }}
      whileInView={{ '--ink': '130%' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration, delay, ease: [0.45, 0.05, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Letter() {
  return (
    <section id="pismo" className="relative isolate overflow-hidden px-5 py-24 sm:px-8 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(243,220,214,0.7),rgba(243,220,214,0)_62%)]"
      />

      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease }}
      >
        <Blossom className="mx-auto h-9 w-9 text-gold" />
        <h2 className="mt-4 font-serif text-[clamp(2.4rem,5.6vw,4.1rem)] font-medium leading-[1.05] text-ink">
          {letter.heading}
        </h2>
      </motion.div>

      <div className="relative mx-auto mt-14 max-w-[44rem] md:mt-20">
        {/* a second sheet peeking out from underneath */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 rounded-md bg-[#F7EDE3] shadow-[0_30px_60px_-40px_rgba(110,70,55,0.5)]"
          initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
          whileInView={{ rotate: 2.2, x: 10, y: 12, opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.6, ease, delay: 0.3 }}
        />
        <motion.article
          className="paper relative px-7 py-14 sm:px-14 sm:py-20 md:px-20"
          initial={{ opacity: 0, y: 46, rotate: -1.4 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 1.5, ease }}
        >
          <span aria-hidden="true" className="paper-frame" />
          <Sprig className="pointer-events-none absolute -left-5 -top-7 h-28 w-28 text-gold/80 sm:-left-12 sm:-top-12 sm:h-40 sm:w-40" />
          <Sprig className="pointer-events-none absolute -bottom-7 -right-5 h-24 w-24 rotate-180 text-gold/70 sm:-bottom-10 sm:-right-10 sm:h-32 sm:w-32" />

          <Ink duration={1.2}>
            <p className="font-script text-[2.7rem] leading-[1.15] text-rose-deep sm:text-[3.3rem]">{letter.greeting}</p>
          </Ink>

          <div className="mt-7 space-y-6 font-serif text-[1.24rem] font-medium leading-[1.72] text-ink sm:mt-9 sm:text-[1.38rem]">
            {letter.paragraphs.map((paragraph, i) => (
              <Ink key={i}>
                <p>{withHearts(paragraph)}</p>
              </Ink>
            ))}
          </div>

          {/* The in-view trigger sits on the unclipped wrapper, the reveal on the text. */}
          <motion.div
            className="mt-12 text-right sm:mt-14"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
          >
            <motion.p
              className="inline-block font-script text-[2.8rem] leading-[1.2] text-rose-deep sm:text-[3.4rem]"
              variants={{
                hidden: { clipPath: 'inset(-30% 100% -30% -5%)' },
                show: { clipPath: 'inset(-30% -5% -30% -5%)' },
              }}
              transition={{ duration: 2.4, ease: [0.45, 0, 0.25, 1], delay: 0.2 }}
            >
              {withHearts(letter.signature, 'text-rose')}
            </motion.p>
          </motion.div>
        </motion.article>
      </div>
    </section>
  )
}
