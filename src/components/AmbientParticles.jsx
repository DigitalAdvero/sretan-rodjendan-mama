import { useEffect, useRef } from 'react'
import { HEART_PATH } from './icons'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)

function glowSprite(rgb, radius) {
  const c = document.createElement('canvas')
  c.width = c.height = radius * 2
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(radius, radius, 0, radius, radius, radius)
  grad.addColorStop(0, `rgba(${rgb},1)`)
  grad.addColorStop(0.22, `rgba(${rgb},0.75)`)
  grad.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, radius * 2, radius * 2)
  return c
}

function heartSprite(color, size) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  g.scale(size / 24, size / 24)
  g.fillStyle = color
  g.fill(new Path2D(HEART_PATH))
  return c
}

/** Golden dust and a few tiny hearts drifting slowly upwards over the page. */
export default function AmbientParticles() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = canvas.getContext('2d')
    const sprites = {
      gold: glowSprite('214,178,112', 24),
      cream: glowSprite('248,231,200', 24),
      roseHeart: heartSprite('#D9A3A6', 64),
      goldHeart: heartSprite('#E2C68F', 64),
    }

    let w = 0
    let h = 0
    let raf = 0
    let last = performance.now()
    const particles = []

    const create = (anywhere) => {
      const heart = Math.random() < 0.13
      return {
        heart,
        x: rand(0, w),
        y: anywhere ? rand(0, h) : h + rand(10, 80),
        size: heart ? rand(7, 12) : rand(2.5, 7),
        speed: heart ? rand(9, 15) : rand(5, 16),
        sway: rand(8, 26),
        freq: rand(0.05, 0.14),
        phase: rand(0, TAU),
        alpha: heart ? rand(0.16, 0.32) : rand(0.25, 0.75),
        twinkle: rand(0.5, 1.4),
        tilt: rand(-0.4, 0.4),
        sprite: heart ? (Math.random() < 0.55 ? 'roseHeart' : 'goldHeart') : Math.random() < 0.6 ? 'gold' : 'cream',
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.round(Math.min(60, Math.max(22, (w * h) / 26000)))
      while (particles.length < target) particles.push(create(true))
      particles.length = target
    }

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = now / 1000
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y -= p.speed * dt
        if (p.y < -30) {
          particles[i] = create(false)
          continue
        }
        const x = p.x + Math.sin(t * p.freq * TAU + p.phase) * p.sway
        ctx.globalAlpha = Math.max(0, p.alpha * (0.6 + 0.4 * Math.sin(t * p.twinkle + p.phase)))
        if (p.heart) {
          ctx.save()
          ctx.translate(x, p.y)
          ctx.rotate(p.tilt + Math.sin(t * 0.7 + p.phase) * 0.18)
          ctx.drawImage(sprites[p.sprite], -p.size / 2, -p.size / 2, p.size, p.size)
          ctx.restore()
        } else {
          ctx.drawImage(sprites[p.sprite], x - p.size, p.y - p.size, p.size * 2, p.size * 2)
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[62] h-full w-full" />
}
