import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

/*
  Sound is OFF by default. When it is switched on:
  - small music-box chimes play on the gift, the cards and the heart
    (synthesised in the browser, no audio files needed);
  - if a song is placed at public/muzika.mp3, it fades in softly and loops.
*/

const MUSIC_SRC = `${import.meta.env.BASE_URL}muzika.mp3`
const MUSIC_VOLUME = 0.35

let ctx = null
let output = null

function audio() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
    output = ctx.createGain()
    output.gain.value = 0.9
    const reverb = ctx.createConvolver()
    reverb.buffer = impulse(ctx, 2.6, 3)
    const wet = ctx.createGain()
    wet.gain.value = 0.3
    output.connect(ctx.destination)
    output.connect(reverb)
    reverb.connect(wet)
    wet.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function impulse(context, seconds, decay) {
  const length = Math.floor(context.sampleRate * seconds)
  const buffer = context.createBuffer(2, length, context.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
  }
  return buffer
}

/** A soft glass bell made of a few sine partials. */
function bell(freq, delay = 0, duration = 2.2, volume = 0.1) {
  const c = audio()
  if (!c) return
  const start = c.currentTime + delay
  for (const [multiple, amount] of [
    [1, 1],
    [2, 0.3],
    [3, 0.09],
    [4.16, 0.045],
  ]) {
    const osc = c.createOscillator()
    const gain = c.createGain()
    const end = start + duration / Math.sqrt(multiple)
    osc.type = 'sine'
    osc.frequency.value = freq * multiple
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume * amount, start + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, end)
    osc.connect(gain)
    gain.connect(output)
    osc.start(start)
    osc.stop(end + 0.05)
  }
}

const SOUNDS = {
  open: () => [783.99, 1046.5, 1318.51, 1567.98, 2093].forEach((f, i) => bell(f, i * 0.12, 2.6, 0.09)),
  reveal: () => [1046.5, 1318.51, 1567.98].forEach((f, i) => bell(f, i * 0.18, 2.4, 0.05)),
  flip: () => {
    bell(1567.98, 0, 1.6, 0.06)
    bell(2093, 0.08, 1.4, 0.045)
  },
  close: () => bell(1318.51, 0, 0.9, 0.035),
  heart: () => {
    bell(523.25, 0, 2.2, 0.09)
    bell(783.99, 0.14, 2, 0.065)
    bell(1046.5, 0.28, 2, 0.05)
  },
  on: () => {
    bell(1046.5, 0, 1.6, 0.05)
    bell(1567.98, 0.1, 1.6, 0.04)
  },
}

function fadeVolume(el, to, ms, done) {
  const from = el.volume
  const startedAt = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - startedAt) / ms)
    el.volume = from + (to - from) * t
    if (t < 1) requestAnimationFrame(step)
    else done?.()
  }
  requestAnimationFrame(step)
}

const SoundContext = createContext({ enabled: false, toggle: () => {}, play: () => {} })

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(false)
  const enabledRef = useRef(false)
  const music = useRef(null)

  const startMusic = useCallback(() => {
    if (music.current === 'missing') return
    if (!music.current) {
      const el = new Audio(MUSIC_SRC)
      el.loop = true
      el.volume = 0
      el.addEventListener('error', () => (music.current = 'missing'), { once: true })
      music.current = el
    }
    const el = music.current
    el.play()
      .then(() => fadeVolume(el, MUSIC_VOLUME, 2500))
      .catch(() => {})
  }, [])

  const stopMusic = useCallback(() => {
    const el = music.current
    if (!el || el === 'missing') return
    fadeVolume(el, 0, 700, () => {
      if (!enabledRef.current) el.pause()
    })
  }, [])

  const toggle = useCallback(() => {
    const next = !enabledRef.current
    enabledRef.current = next
    setEnabled(next)
    if (next) {
      SOUNDS.on()
      startMusic()
    } else {
      stopMusic()
    }
  }, [startMusic, stopMusic])

  const play = useCallback((name) => {
    if (enabledRef.current) SOUNDS[name]?.()
  }, [])

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play])
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export const useSound = () => useContext(SoundContext)
