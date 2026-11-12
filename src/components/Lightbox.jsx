import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ui } from '../content'
import { useScrollLock } from '../lib/scroll'
import { ChevronIcon, CloseIcon } from './icons'

const slide = {
  enter: (dir) => ({ x: dir > 0 ? 140 : dir < 0 ? -140 : 0, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? -140 : dir < 0 ? 140 : 0, opacity: 0, scale: 0.96 }),
}

function trapFocus(event, root) {
  const focusable = root?.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
  if (!focusable?.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

/** Full-screen photo viewer: arrows, keyboard, swipe, thumbnails. */
export default function Lightbox({ items, index, onIndex, onClose }) {
  const current = index !== null ? items[index] : null
  const open = Boolean(current)
  const [direction, setDirection] = useState(0)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const returnFocus = useRef(null)
  const wasOpen = useRef(false)
  useScrollLock(open)

  const count = items.length
  const paginate = useCallback(
    (step) => {
      if (count < 2) return
      setDirection(step)
      onIndex((i) => (i + step + count) % count)
    },
    [count, onIndex],
  )

  const jump = (i) => {
    if (i === index) return
    setDirection(i > index ? 1 : -1)
    onIndex(i)
  }

  useEffect(() => {
    if (open && !wasOpen.current) {
      setDirection(0)
      returnFocus.current = document.activeElement
      requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }))
    }
    if (!open && wasOpen.current) returnFocus.current?.focus?.({ preventScroll: true })
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') paginate(1)
      else if (e.key === 'ArrowLeft') paginate(-1)
      else if (e.key === 'Tab') trapFocus(e, dialogRef.current)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, paginate])

  // Rendered at the end of <body> so it sits above everything else on the page.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={ui.lightbox}
          className="fixed inset-0 z-[70] flex flex-col overscroll-contain bg-[rgba(32,23,21,0.94)] backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] text-[#F3E7D7] sm:px-8 sm:pt-6">
            <span className="font-serif text-lg italic tracking-wide text-[#F3E7D7]/80" aria-live="polite">
              {index + 1} / {count}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={ui.close}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-colors duration-300 hover:bg-white/10"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 touch-none select-none">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={current.url}
                src={current.url}
                alt={current.alt}
                draggable={false}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: 'spring', stiffness: 240, damping: 30 }, opacity: { duration: 0.35 }, scale: { duration: 0.45 } }}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.75}
                onDragEnd={(_, { offset, velocity }) => {
                  if (offset.x < -70 || velocity.x < -500) paginate(1)
                  else if (offset.x > 70 || velocity.x > 500) paginate(-1)
                }}
                className="absolute inset-0 h-full w-full cursor-grab object-contain px-3 py-3 active:cursor-grabbing sm:px-24 sm:py-4"
              />
            </AnimatePresence>
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => paginate(-1)}
                  aria-label={ui.prev}
                  className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/10 text-[#F3E7D7] backdrop-blur transition-colors duration-300 hover:bg-white/10 sm:left-6 sm:grid"
                >
                  <ChevronIcon direction="left" className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => paginate(1)}
                  aria-label={ui.next}
                  className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/10 text-[#F3E7D7] backdrop-blur transition-colors duration-300 hover:bg-white/10 sm:right-6 sm:grid"
                >
                  <ChevronIcon direction="right" className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          <div className="px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={current.url}
                className="font-serif text-[1.3rem] font-medium italic text-[#F3E7D7] sm:text-[1.5rem]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
              >
                {current.caption}
              </motion.p>
            </AnimatePresence>

            {count > 1 && (
              <div className="mx-auto mt-5 flex max-w-full justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {items.map((item, i) => (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => jump(i)}
                    aria-label={ui.goToPhoto(i + 1)}
                    aria-current={i === index ? 'true' : undefined}
                    className={`relative h-12 w-9 shrink-0 overflow-hidden rounded-md transition duration-300 sm:h-14 sm:w-11 ${
                      i === index ? 'opacity-100 ring-1 ring-gold-light ring-offset-2 ring-offset-[#201715]' : 'opacity-45 hover:opacity-80'
                    }`}
                  >
                    <img src={item.url} alt="" draggable={false} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
