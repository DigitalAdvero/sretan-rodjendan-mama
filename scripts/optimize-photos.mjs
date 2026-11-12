// Prepares photos for the website.
//
//   1. Put your original photos into the `photos-original/` folder, named
//      photo-1 … photo-9 (gallery) and mama (the portrait at the top).
//      Any of .jpg .jpeg .png .webp .heic .avif .tif works.
//   2. Run:  npm run photos
//
// Each photo is rotated upright, resized to at most 2000 px, saved as an
// optimized JPG in public/photos/, and stripped of metadata (including GPS
// location), so it is safe and fast to put online.
import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.resolve('photos-original')
const OUT = path.resolve('public/photos')
const MAX = 2000
const NAME = /^(photo-[1-9]|mama)$/

await mkdir(OUT, { recursive: true })
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|heic|heif|avif|tiff?)$/i.test(f))

if (!files.length) console.log('No photos found in photos-original/.')

for (const file of files) {
  const name = path.parse(file).name.toLowerCase()
  if (!NAME.test(name)) {
    console.log(`Skipped ${file}: name it photo-1 … photo-9 or mama.`)
    continue
  }
  const input = sharp(path.join(SRC, file)).rotate()
  const { width = 0, height = 0 } = await input.metadata()
  const small = Math.max(width, height) < 1400
  const info = await input
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: small ? 92 : 82, mozjpeg: true, progressive: true })
    .toFile(path.join(OUT, `${name}.jpg`))
  console.log(`✓ ${file} → public/photos/${name}.jpg  (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`)
}
