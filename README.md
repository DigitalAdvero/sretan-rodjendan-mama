# Sretan 41. rođendan, mama — source

The editable project behind the birthday website: React 19, Tailwind CSS 3 and Framer Motion 12, built with Vite into one self-contained `index.html`.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173 — add ?instant to skip animations while checking layouts
npm run build    # dist/: index.html (code, styles, fonts inlined) + content.js + photos/ + README.md
npm run photos   # photos-original/* → public/photos/*.jpg (upright, max 2000 px, GPS/EXIF removed)
```

## Where things are

| Path | Contents |
| --- | --- |
| `public/content.js` | Every text on the page (a plain script, so it can be edited after building) |
| `public/photos/` | `mama.jpg` and `photo-1.jpg` … `photo-9.jpg` |
| `src/components/` | One file per section: Intro (gift), Hero, Letter, Gallery + Lightbox, Surprises, Dova, Finale |
| `src/lib/` | Smooth scrolling (Lenis), sound (Web Audio chimes, optional `muzika.mp3`), photo loading |
| `public/README.md` | The README that ships with the built site |

## Publishing an update

The `main` branch holds the built site. After `npm run build`, copy everything inside `dist/` over the files on `main` and push.
