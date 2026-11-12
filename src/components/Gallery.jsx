import { motion, useScroll, useTransform } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gallery, ui } from '../content'
import { ease } from '../lib/motion'
import { photoUrl, usePhotoInfo } from '../lib/photos'
import { Sprig } from './icons'
import Lightbox from './Lightbox'
import PhotoTile from './PhotoTile'

// Shape (height ÷ width) of every frame in the desktop collage, in photo order.
const SLOT_RATIOS = [1.33, 1.3, 0.54, 1.33, 1.33, 1.33, 0.54, 1.33, 1.3]
const MOBILE_RATIO = 1.25

function Collage({ items, info, onOpen }) {
  const rowRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start end', 'end start'] })
  const drift = [
    useTransform(scrollYProgress, [0, 1], [24, -24]),
    useTransform(scrollYProgress, [0, 1], [70, -50]),
    useTransform(scrollYProgress, [0, 1], [40, -34]),
  ]
  const tile = (item, className = '') => (
    <PhotoTile key={item.index} item={item} info={info[item.url]} slotRatio={SLOT_RATIOS[item.index]} onOpen={onOpen} className={className} />
  )

  return (
    <div style={{ '--gap': 'clamp(14px, 1.8vw, 24px)' }}>
      <div className="collage-a">{items.slice(0, 3).map((item) => tile(item))}</div>

      <motion.div
        className="mx-auto flex max-w-xl flex-col items-center py-16 text-center lg:py-20"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.3, ease }}
      >
        <Sprig className="h-14 w-14 -rotate-[38deg] text-gold/80" />
        <p className="mt-3 text-balance font-serif text-[clamp(1.6rem,2.6vw,2.15rem)] font-medium italic leading-snug text-rose-deep">
          {gallery.interlude}
        </p>
      </motion.div>

      <div ref={rowRef} className="grid grid-cols-3 items-start gap-[calc(var(--gap)*1.7)] px-[3%]">
        {items.slice(3, 6).map((item, i) => (
          <motion.div key={item.index} style={{ y: drift[i] }} className={i === 1 ? 'mt-[16%]' : i === 2 ? 'mt-[5%]' : ''}>
            {tile(item, 'aspect-[3/4] w-full')}
          </motion.div>
        ))}
      </div>

      <div className="collage-c mt-[calc(var(--gap)*4)]">{items.slice(6, 9).map((item) => tile(item))}</div>
    </div>
  )
}

function Carousel({ items, info, onOpen }) {
  const scroller = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = scroller.current
    if (!el) return undefined
    let frame = 0
    const measure = () => {
      frame = 0
      const center = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let bestDistance = Infinity
      Array.from(el.children).forEach((child, i) => {
        const distance = Math.abs(child.offsetLeft + child.offsetWidth / 2 - center)
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
      })
      setActive(best)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    measure()
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [items.length])

  const goTo = (i) => {
    const el = scroller.current
    const child = el?.children[i]
    if (!child) return
    el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={scroller}
        className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[9vw] pb-3"
      >
        {items.map((item, i) => (
          <figure key={item.index} className="w-[82vw] max-w-[380px] shrink-0 snap-center">
            <PhotoTile item={item} info={info[item.url]} slotRatio={MOBILE_RATIO} onOpen={onOpen} showCaption={false} className="aspect-[4/5] w-full" />
            <figcaption
              className={`mt-4 min-h-[3.2rem] text-balance px-2 text-center font-serif text-[1.2rem] font-medium italic leading-snug text-rose-deep transition-opacity duration-500 ${
                active === i ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {info[item.url]?.status === 'error' ? '' : item.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.index}
            type="button"
            onClick={() => goTo(i)}
            aria-label={ui.goToPhoto(i + 1)}
            aria-current={active === i ? 'true' : undefined}
            className="grid h-6 place-items-center px-[3px]"
          >
            <span
              className={`block h-[5px] rounded-full transition-all duration-500 ${active === i ? 'w-5 bg-gold' : 'w-[5px] bg-gold/35'}`}
            />
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-[0.92rem] font-light text-ink-faint">{gallery.hintMobile}</p>
    </div>
  )
}

export default function Gallery() {
  const items = useMemo(
    () =>
      gallery.photos.map((photo, index) => ({
        ...photo,
        index,
        url: photoUrl(photo.src),
        alt: ui.photoAlt(index + 1),
      })),
    [],
  )
  const info = usePhotoInfo(items.map((item) => item.url))
  const viewable = items.filter((item) => info[item.url]?.status !== 'error')
  const [openAt, setOpenAt] = useState(null)

  const open = useCallback(
    (index) => {
      const position = viewable.findIndex((item) => item.index === index)
      if (position >= 0) setOpenAt(position)
    },
    [viewable],
  )
  const close = useCallback(() => setOpenAt(null), [])

  return (
    <section id="uspomene" className="relative px-5 py-24 sm:px-8 md:py-36">
      <motion.header
        className="mx-auto max-w-6xl md:grid md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease }}
      >
        <h2 className="text-balance font-serif text-[clamp(2.5rem,6vw,4.4rem)] font-medium leading-[1.02] text-ink">
          {gallery.heading}
        </h2>
        <div className="mt-5 md:mt-0">
          <p className="max-w-md text-[1.1rem] font-light leading-relaxed text-ink-soft sm:text-[1.18rem]">{gallery.subtitle}</p>
          <p className="mt-4 hidden text-[0.92rem] font-light text-ink-faint md:block">{gallery.hintDesktop}</p>
        </div>
      </motion.header>

      <div className="mx-auto mt-14 hidden max-w-6xl md:block lg:mt-20">
        <Collage items={items} info={info} onOpen={open} />
      </div>
      <div className="-mx-5 mt-12 sm:-mx-8 md:hidden">
        <Carousel items={items} info={info} onOpen={open} />
      </div>

      <Lightbox items={viewable} index={openAt} onIndex={setOpenAt} onClose={close} />
    </section>
  )
}
