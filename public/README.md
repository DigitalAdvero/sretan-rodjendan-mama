# Sretan 41. rođendan, mama ❤

A digital birthday gift. Open `index.html`, click the gift, and scroll.

| File | What it is |
| --- | --- |
| `index.html` | The whole website (code, styles and fonts are inside this one file) |
| `content.js` | Every text on the page — edit it right here on GitHub |
| `photos/` | `mama.jpg` (the arched portrait) and `photo-1.jpg` … `photo-9.jpg` (the gallery) |

## Put it online with GitHub Pages

1. In this repository open **Settings → Pages**.
2. Under **Build and deployment** choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and click **Save**.
3. After a minute the address appears at the top of that page, like `https://<username>.github.io/<repository>/`. That is the link to send.

Free GitHub accounts can publish Pages only from public repositories.

## Change a photo

- Upload the new photo into `photos/` with **exactly the same name** as the one it replaces (open `photos/`, then **Add file → Upload files**).
- `photo-9.jpg` is optional. Until it exists, its place shows *“I za sve uspomene koje tek dolaze…”*.
- `photo-3.jpg` and `photo-7.jpg` sit in wide frames, so horizontal photos look best there. If a photo's shape doesn't suit its frame, the whole photo is shown over a soft blurred copy instead of being cropped.
- About 1600–2000 px on the long side is plenty. Larger photos make the page slow on phones.
- Phone photos usually contain the GPS location where they were taken. Remove it before uploading to a public repository (on the `source` branch, `npm run photos` resizes photos and strips this data automatically).

## Change the text

All text is in `content.js`. Open it, click the pencil icon, change the words between the quotes, and commit. Keep every quote and comma: if the page only shows *“Stranica se trenutno ne može otvoriti”*, a quote or comma went missing in the last edit.

## Music (optional)

Upload a song named `muzika.mp3` next to `index.html`. It fades in softly only after the sound button (top right) is switched on. The page is silent by default.

## Open it without internet

**Code → Download ZIP**, unzip, and double-click `index.html`.

## Source code

The editable project (React, Tailwind CSS, Framer Motion) is on the `source` branch.
