import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { gallery } from '../content'
import { ease } from '../lib/motion'
import { Blossom } from './icons'

/** Shown where a photo is not available yet (e.g. photo-9.jpg). */
export function EmptyTile({ className = '' }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-[14px] px-8 py-10 text-center ${className}`}
      style={{ background: 'linear-gradient(160deg, #FAF0E7 0%, #F4E0D9 58%, #EFD8CE 100%)' }}
    >
      <span aria-hidden="true" className="absolute inset-3 rounded-[10px] border border-gold/35" />
      <Blossom className="h-10 w-10 text-gold" />
      <p className="mt-5 max-w-[16rem] text-balance font-serif text-[clamp(1.45rem,2.3vw,1.95rem)] font-medium italic leading-snug text-rose-deep">
        {gallery.emptyTitle}
      </p>
      <p className="mt-3 text-[0.95rem] font-light text-ink-soft">{gallery.emptyText}</p>
    </div>
  )
}

/**
 * One photo in the collage or the carousel. It "develops" like a print the
 * first time it comes into view. If the photo's shape is very different from
 * its frame, the whole photo is shown over a soft blurred copy of itself
 * instead of being cropped.
 */
export default function PhotoTile({ item, info, slotRatio, onOpen, className = '', showCaption = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const [loaded, setLoaded] = useState(false)
  const [broken, setBroken] = useState(false)

  if (broken || info?.status === 'error') return <EmptyTile className={className} />

  const ratio = info?.ratio
  const mismatch = ratio ? Math.max(ratio / slotRatio, slotRatio / ratio) : 1
  const contain = item.fit === 'contain' || (item.fit !== 'cover' && mismatch > 1.6)
  const visible = inView && loaded

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(item.index)}
      aria-label={`${item.alt}. ${item.caption}`}
      className={`group relative block cursor-zoom-in overflow-hidden rounded-[14px] bg-champagne-light text-left shadow-[0_26px_50px_-34px_rgba(90,55,45,0.55)] ${className}`}
    >
      {contain && (
        <img
          src={item.url}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl"
        />
      )}
      <motion.img
        src={item.url}
        alt={item.alt}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setBroken(true)}
        className={`absolute inset-0 h-full w-full ${contain ? 'object-contain' : 'object-cover'}`}
        style={{ objectPosition: item.focus }}
        initial={false}
        animate={
          visible
            ? { opacity: 1, scale: 1, filter: 'sepia(0) saturate(1) blur(0px)' }
            : { opacity: 0, scale: 1.06, filter: 'sepia(0.6) saturate(0.7) blur(10px)' }
        }
        transition={{ duration: 1.9, ease }}
      />
      {showCaption && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-[rgba(48,30,26,0.6)] via-[rgba(48,30,26,0.2)] to-transparent px-5 pb-4 pt-16 font-serif text-[1.15rem] font-medium italic leading-snug text-[#FFF6EE] opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          {item.caption}
        </span>
      )}
    </button>
  )
}
