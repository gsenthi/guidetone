# Guide Tone

A jazz piano practice app that plans a smart 15-minute warm-up every day: a circle-of-5ths recall opener, then rhythm, circle-of-5ths playing drills, scales, patterns, chord extensions and reharmonisation, all in 12 keys. Each item is scored 1–10, and spaced repetition plus tempo ladders decide what comes back and when.

It is a React + Vite progressive web app: install it to your home screen and it works offline.

## Use it
Open the deployed site, or run it locally:

```
npm install
npm run dev
```

Progress is saved in that browser; use Settings → Back up your progress to move it elsewhere.

## Tests
```
npm test
```

## Deploy on Vercel
1. In Vercel, choose **Add New → Project** and import this GitHub repo.
2. Leave the settings as they are (Vercel reads `vercel.json`: build with `npm run build`, output `dist`) and press **Deploy**.
3. Every push to `main` redeploys automatically.

`prototype/index.html` is the original single-file version, kept as the reference the tests compare against. See `CLAUDE.md` for the architecture, the theory engine's conventions and the roadmap.
