// Shared easing curves and tiny helpers for animations.
export const ease = [0.22, 1, 0.36, 1]
export const easeInOut = [0.65, 0, 0.35, 1]

export const rand = (min, max) => min + Math.random() * (max - min)

/** Small deterministic random generator, so stars stay in the same places. */
export function seeded(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
