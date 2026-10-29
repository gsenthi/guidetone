# Guide Tone

An all-in-one jazz piano practice app (formerly called Woodshed) built around a smart 15-minute daily warm-up. It decides what Ganesh should practise each day across all 12 keys, then tracks how it went.

It is a React + Vite PWA (installable, works offline), deployed on Vercel. It was ported from a single-file vanilla-JS prototype, which is kept in `prototype/index.html` as the behavioural reference: `tests/parity.test.js` checks the ported theory engine and scheduler against it.

## The name
Guide tones are the 3rd and 7th: the two notes that define a chord and lead smoothly into the next. The app is built around them (shell voicings, guide-tone lines down the circle), and its job is to guide what Ganesh practises each day.

## Working with Ganesh

- British spelling and terminology throughout, in code comments and UI copy (colour, practise as a verb, crotchet/quaver, bar, semitone).
- He has a limited coding background and works in a browser stack: StackBlitz, GitHub, Vercel, Supabase. No local dev environment. Explain steps plainly.
- He prefers complete file outputs over partial diffs when you share code with him.
- He is a jazz piano learner who practises in roughly 15-minute daily sessions. Musical correctness matters more than features: wrong enharmonic spelling or a bad voicing is a real bug.

## Running and testing

- `npm install`, then `npm run dev` for a local server with hot reload (StackBlitz runs this automatically). `npm run build` produces `dist/`; `npm run preview` serves it with the service worker on.
- `npm test` runs Vitest: `tests/theory.test.js` (regression checks on the theory engine and scheduler) and `tests/parity.test.js` (runs the prototype's inline script headless via its `globalThis.__WS` export and compares spellings, voicings, curricula, reading scores and daily plans with the ported modules). Keep both passing. If behaviour is changed on purpose, the parity test will flag it: update or retire the relevant check rather than the prototype.
- Vercel: import the repo and it builds with the defaults in `vercel.json` (`npm run build` → `dist`). Pushes to `main` redeploy.
- Progress is stored in `localStorage` under `guidetone.v1` (it falls back to reading the older `woodshed.v1` key from the prototype). Settings → "Back up your progress" gives a JSON blob that can be pasted into Restore on another origin.

## Product shape

Six practice areas ("domains"), each with items in all 12 keys:

| Domain | id prefix | What it drills |
|---|---|---|
| Rhythm & time | `rh:`, `rd:` | Time-feel metronome modes (2 & 4, beat 4 only, bar on/off, etc.), subdivisions and polyrhythms, and tap-along rhythm reading scored against the grid |
| Circle of 5ths | `cy:` | Dominant 7ths round the circle, guide tones down the circle, ii–V–I down the circle, diatonic cycle in major and minor; plus `cy:quiz`, a 60-second recall opener |
| Scales & speed | `sc:` | 13 scales with per-item tempo ladders |
| Patterns & lines | `pt:` | Digital patterns and an enclosure over a ii–V–I |
| Chords & extensions | `ch:` | 25 chord qualities (maj9, 6/9, 13, sus, alt, 9♯11 …). Spell it, then play LH root + guide tone, RH colour tones |
| Reharmonisation | `rx:` | 19 techniques (tritone sub, backdoor, secondary dominants, approach chords, Lady Bird, Coltrane…). A plain progression and a technique; the user works out the spiced version, then reveals it. `rx:mix:<pc>` is the mixed reharm, which unlocks after 4 techniques are solid |

Item ids are `<prefix>:<sub>:<pitch-class>` (pitch class 0 = C … 11 = B), except rhythm items and `cy:quiz`, which have no key.

### Daily planner (`makePlan`)
- Picks a key of the day (`pickKey`): cycles round the circle of 4ths at first, then favours keys with low average scores and keys not focused on recently.
- Scores each domain by its weight (Settings → Focus), days since last practised and items due, keeps the top N for the session length (10/15/20/30 min), and splits the minutes.
- If the opener is on, prepends a 1-minute `cy:quiz` block.
- Within a block (`pickItems`): due and overdue items first, boosted for today's key and for low last scores; new items come from the per-domain curriculum `CURR[domain]`, capped by Settings → "New items per area".
- Curricula are built with `diag()`, which staggers stages of item types across key groups so new types keep arriving instead of waiting for all 12 keys.

### Scoring and spaced repetition (`review`)
- Every item is scored 1–10. `state.items[id].hist` stores the last 8 scores; `mastery()` is a recency-weighted average mapped to 0–1.
- 1–3 resets the interval; 4–6 roughly holds it; 7–10 grows it by ease × a factor (0.8 / 1 / 1.15 / 1.3).
- Tempo-ladder items: 8–9 → +4 bpm next time, 10 → +6, 5–7 → same, ≤4 → −8 (−12 for 1–2). `best` records the fastest tempo scored 8 or more.
- Older saved data used "nailed/shaky/missed"; `load()` migrates those to 9/5/2.

### Theory engine (top of the script)
- `spell(root, degree, semitones)` gives the correct letter name for a scale degree (so the 7th of G♭7 is F♭, the 3rd of B7 is D♯). Use it for everything. Never spell notes from a flat/sharp lookup table.
- `QUAL` defines chord qualities: `tones` (full spelling as [degree, semitones]) and `four` (the four-note subset used for rootless/drop voicings).
- `TECH` defines reharm techniques as `base` and `spice` arrays of bars. Each bar holds 1–2 chords `K(numeral, degree, semitones, quality, isNew)`. Base and spice must have the same number of bars (checked by a test).
- `CYC` defines circle drills; `QZ` defines the recall question types.
- Chord roots that would be spelt with a double accidental, F♭, C♭, E♯ or B♯ fall back to the simpler enharmonic (so E9♯11, not F♭9♯11).
- `voiceTexture(chords, tex)` voice-leads a sequence in one of five textures: `guide` (3rds & 7ths), `shells` (LH root + guide tone, RH colour), `rootless`, `drop2`, `drop3`. It chooses, chord by chord, the candidate with the least top-weighted movement from the previous voicing.

### UI conventions that were deliberate user requests
- Progressions show **Roman numerals only**. Chord names are hidden until tapped (Settings → "Chord names over numerals"), to force working out the chord from its numeral in the key.
- Keyboards are **collapsed** behind a "Show on the keyboard" / "Voicings on the keyboard" toggle.
- Reharm answers stay hidden for techniques seen before; they are shown the first time a technique appears.
- Chords drill **qualities and extensions**, not a catalogue of voicings.
- Rhythm-reading attempts suggest a 1–10 score from hit rate, timing error and extra taps.

### Code layout
- `src/theory/`: notes and spelling (`notes.js`), `QUAL`, chords in a key (`chords.js`), `TECH`, `CYC`/`QZ`, `SCALE`/`PAT`, rhythm drills, and voicing. Pure functions only.
- `src/engine/`: the item catalogue and curricula, storage (`store.js` holds `state`), scores, `review`, the planner, the mixed-reharm unlock, quiz weighting and reading evaluation.
- `src/audio/`: the synth and the look-ahead metronome.
- `src/components/`: shared widgets (`common.jsx`: keyboard, bars, folds, rate row, metronome strip, circle) and `cards/`, one component per card type. `src/views/` holds the six screens.
- `src/ui.js` holds screen state that isn't saved (`UI`: view, the live card's scratch state, library selection). Handlers mutate `state`/`UI` and call `render()`, which re-renders the app, just as the prototype did. A new card gets fresh `UI.card` state when the item changes.

### Visual design
Tokens are defined on `:root` with dark-mode overrides. Fonts: Big Shoulders Display (display), Instrument Sans (body) and IBM Plex Mono (data). Accent is a cobalt blue. Keep the existing look. The styles live in `src/styles.css`, unchanged from the prototype.

Settings → Look also offers **Black & white** (`settings.look: 'mono'`, applied as `data-look="mono"` on `<html>`): white page, black ink, Helvetica, square corners, no colour. Where colour carried meaning it is replaced, not dropped: mastery squares fill from the bottom (¼ for 1–3 up to solid for 9–10), played keys get a solid name tag, quiz answers are solid (right) or struck through (wrong), and reading taps are solid / hollow / crossed squares. Any new colour-coded UI needs a black-and-white equivalent in the `[data-look="mono"]` block at the end of `styles.css`.

## Roadmap

1. ~~Port to React + Vite PWA~~ (done: see "Code layout").
2. Supabase sync of `state`, so progress follows Ganesh across devices.
3. Proper rhythm notation for reading drills, which currently use a counting grid.
4. Optional Web MIDI input to auto-check chords and timing (Chrome/Edge only; keep self-rating as the default).
5. Ideas raised but not built: Jazz Ear integration for ear-training items; tune-based drills (play a standard's changes in a new key).

## Known limitations
- Audio is a simple Web Audio synth, not sampled piano.
- All state is in one browser; nothing syncs yet.
- The rhythm-reading tap timing assumes small device latency; Settings has a manual tap offset.
