import { useEffect, useState } from 'react'

export const photoUrl = (name) => `${import.meta.env.BASE_URL}photos/${name}`

/**
 * Loads every photo in the background (while the gift is still closed) and
 * reports whether it exists and its shape, so missing photos can show a
 * placeholder and unusual shapes are never cropped badly.
 * Returns { [url]: { status: 'ok' | 'error', ratio: height / width } }.
 */
export function usePhotoInfo(urls, delay = 400) {
  const [info, setInfo] = useState({})
  const key = urls.join('|')

  useEffect(() => {
    let alive = true
    const images = []
    const timer = setTimeout(() => {
      for (const url of key.split('|')) {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () =>
          alive && setInfo((s) => ({ ...s, [url]: { status: 'ok', ratio: img.naturalHeight / img.naturalWidth } }))
        img.onerror = () => alive && setInfo((s) => ({ ...s, [url]: { status: 'error' } }))
        img.src = url
        images.push(img)
      }
    }, delay)
    return () => {
      alive = false
      clearTimeout(timer)
      for (const img of images) img.onload = img.onerror = null
    }
  }, [key, delay])

  return info
}
