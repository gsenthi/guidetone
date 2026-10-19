# Guide Tone

**A jazz piano practice app that decides what to practise each day, in all 12 keys, and remembers how it went.**

Guide tones are the 3rd and 7th of a chord: the two notes that define it and lead smoothly into the next one. The app is built around them (shell voicings, guide-tone lines down the circle of 5ths), and its job is to guide your daily practice.

## Why it exists

Most jazz piano learners have the same problems:

- **Practising in the comfortable keys.** It's easy to keep playing ii–V–Is in C, F and B♭ and avoid B or D♭.
- **Not knowing what to work on today.** Chords, scales, rhythm, reharmonisation and theory all compete for a short practice slot.
- **Forgetting what was learnt.** A voicing that felt solid last month has quietly gone.

Guide Tone gives you a focused 15-minute warm-up every day. It picks a key of the day, chooses what is due, weak or neglected across six areas, and uses spaced repetition so material comes back just before you would forget it.

## What you practise

| Area | What it drills |
|---|---|
| **Rhythm & time** | Time feel against the metronome (click on 2 and 4, beat 4 only, bar on/bar off…), subdivisions and polyrhythms, and tap-along rhythm reading scored against the grid |
| **Circle of 5ths** | Dominant 7ths round the circle, guide tones down the circle, ii–V–I down the circle, diatonic cycles in major and minor, and a 60-second recall quiz to open each session |
| **Scales & speed** | 13 scales, from major and the modes to bebop, altered and diminished, each with its own tempo ladder |
| **Patterns & lines** | Digital patterns and enclosures over a ii–V–I |
| **Chords & extensions** | 25 chord qualities (maj9, 6/9, 13, sus, 7alt, 9♯11…): spell it, then play root and guide tone in the left hand and colour tones in the right |
| **Reharmonisation** | 19 techniques (tritone sub, backdoor ii–V, secondary dominants, approach chords, Lady Bird, Coltrane…): work out the spiced-up version of a plain progression, then reveal it. A mixed reharm unlocks once four techniques are solid |

## Features

- **Daily plan.** A key of the day and a timed session (10, 15, 20 or 30 minutes) split across areas, with a reason shown for every choice.
- **Spaced repetition.** Score each item 1–10. Low scores bring it back sooner; high scores push it further away.
- **Tempo ladders.** Scales, patterns and progressions speed up when you play them cleanly and slow down when they fall apart.
- **Correct spelling.** Every note is spelt from its scale degree, so the 7th of G♭7 is F♭ and the 3rd of B7 is D♯.
- **Voice-led voicings.** Progressions can be shown and heard as guide tones, shells, rootless, drop 2 or drop 3 voicings, each moving as little as possible from chord to chord.
- **Roman numerals first.** Chord names stay hidden until you tap them, so you work out each chord from its numeral in the key.
- **Built-in metronome and sound.** A click with jazz time-feel modes, and playback of chords, lines and progressions.
- **Progress map.** A streak, a four-week calendar and a heat map of every item in every key.
- **Library.** Drill any item directly, in one key or round all 12.
- **Installable and offline.** Add it to your home screen; it works without a connection.
- **Private.** Your progress stays in your browser. Settings → *Back up your progress* exports it as text you can restore elsewhere.

## Getting started

### Use it
Open the deployed site in any modern browser. On a phone, use *Add to Home Screen* to install it like an app.

### Run it locally
You need [Node.js](https://nodejs.org) 20.19 or newer.

```
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173). In StackBlitz, opening the repo does this for you.

| Command | What it does |
|---|---|
| `npm run dev` | Starts a local server that reloads as you edit |
| `npm test` | Runs the test suite |
| `npm run build` | Builds the finished site into `dist/` |
| `npm run preview` | Serves the built site, with offline support switched on |

## Deploying

The app is a static site, set up for [Vercel](https://vercel.com):

1. In Vercel, choose **Add New → Project** and import this GitHub repository.
2. Leave the settings as they are (`vercel.json` sets the build) and press **Deploy**.
3. Every push to `main` redeploys automatically.

Progress is stored per web address, so moving to a new address starts empty. Use Settings → *Back up your progress* on the old one and *Restore* on the new one.

## Tech stack

- [React](https://react.dev) and [Vite](https://vite.dev)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app) for installation and offline support
- The Web Audio API for the synth and metronome
- [Vitest](https://vitest.dev) for tests
- No backend: progress is saved in `localStorage`

## Project structure

```
src/
  theory/       Music theory: note spelling, chord qualities, reharm techniques,
                circle drills, scales, patterns, voicing and voice-leading
  engine/       The item catalogue, daily planner, spaced repetition and storage
  audio/        Synth and metronome
  components/   Shared widgets, and cards/ with one component per drill type
  views/        Today, Session, Library, Progress and Settings screens
tests/          Theory and scheduler tests, plus a parity test against the prototype
prototype/      The original single-file version, kept as the behavioural reference
public/         App icons
```

`CLAUDE.md` has a more detailed guide to the architecture and the theory engine's conventions.

## Testing

`npm test` runs two suites:

- **`tests/theory.test.js`** checks spelling, chord voicings, reharm spellings, guide-tone voice-leading, the daily planner and the 1–10 scheduling rules.
- **`tests/parity.test.js`** runs the original prototype and checks that the app still gives identical spellings, voicings, curricula, rhythm-reading scores and daily plans.

Musical correctness matters more than features here: a wrong enharmonic spelling or a bad voicing counts as a bug.

## Roadmap

- [x] Port to a React + Vite progressive web app
- [ ] Sync progress across devices with Supabase
- [ ] Proper rhythm notation for reading drills (they currently use a counting grid)
- [ ] Optional Web MIDI input to check chords and timing automatically (Chrome and Edge; self-scoring stays the default)
- [ ] Ideas: ear-training items, and tune-based drills (play a standard's changes in a new key)

## Known limitations

- The sound is a simple synthesiser, not a sampled piano.
- Progress lives in one browser and doesn't sync yet.
- Rhythm-reading timing depends on your device's audio delay. Settings has a tap offset to correct for it.

## Contributing

This is a personal practice tool, but suggestions and bug reports are welcome: open an issue on GitHub. If you send a change:

- Use British spelling and terminology in code comments and on screen (colour, *practise* as a verb, crotchet, quaver, bar).
- Spell notes with `spell()` from the theory engine, never from a sharp/flat lookup table.
- Make sure `npm test` passes.

## Licence

No licence has been chosen yet, so all rights are reserved by the author.
