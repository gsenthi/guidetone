// Regression checks for Guide Tone's theory engine and scheduler.
// Run with: node tests/theory.test.mjs
// It pulls the app's <script> out of index.html and runs it headless; the app
// exposes its pure functions on globalThis.__WS for exactly this purpose.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = readFileSync(fileURLToPath(new URL('../index.html', import.meta.url)), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
const ctx = { console, performance, Math, Date, JSON };
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(script, ctx);
const W = ctx.__WS;

let passed = 0;
const check = (name, fn) => { fn(); passed++; console.log('ok  ', name); };
const names = v => v.map(n => n.name).join(' ');

check('scale spelling keeps one letter per degree', () => {
  assert.equal(names(W.scaleNotes('major', 6)), 'G♭ A♭ B♭ C♭ D♭ E♭ F G♭');
  assert.equal(names(W.scaleNotes('dorian', 1)), 'C♯ D♯ E F♯ G♯ A♯ B C♯');
  assert.equal(names(W.scaleNotes('bebopdom', 1)), 'D♭ E♭ F G♭ A♭ B♭ C♭ C D♭');
});

check('extension degrees label correctly', () => {
  assert.equal(W.QUAL.alt.tones.map(W.degLabel).join(' '), '1 3 ♭7 ♭9 ♯9 ♯11 ♭13');
  assert.equal(W.QUAL.dom13.tones.map(W.degLabel).join(' '), '1 3 5 ♭7 9 13');
});

check('two-hand chord voicing: root + guide tone in LH', () => {
  const v = W.twoHand('dom13', 1); // D♭13
  assert.equal(names(v.lh), 'D♭ C♭');
  assert.ok(v.rh.every(n => n.midi >= 58), 'RH sits above middle-C area');
});

check('reharm spellings avoid F♭/C♭ roots', () => {
  const X = W.TECH.tt;
  const syms = W.barsInKey(X.spice, 3, X.mode).flat().map(c => c.sym);
  assert.deepEqual([...syms], ['Fm7', 'E9♯11', 'E♭maj7', 'E♭maj7']);
  const lb = W.barsInKey(W.TECH.ladybird.spice, 3, 'maj').flat().map(c => c.sym);
  assert.deepEqual([...lb], ['E♭maj7', 'G♭maj7', 'Bmaj7', 'Emaj7', 'E♭maj7']);
});

check('every reharm technique has bar-aligned base and spice', () => {
  for (const [k, X] of Object.entries(W.TECH)) assert.equal(X.base.length, X.spice.length, k);
});

check('guide-tone texture moves by step down the cycle', () => {
  const roots = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const chain = [...Array(12)].map((_, i) => { const pc = (5 * i) % 12; return { q: 'dom7', root: roots[pc], rootName: roots[pc], pc }; });
  const v = W.voiceTexture(chain, 'guide');
  for (let i = 1; i < v.length; i++) {
    const move = Math.max(...v[i].map((n, j) => Math.abs(n.midi - v[i - 1][j].midi)));
    assert.ok(move <= 2, `step ${i} moved ${move} semitones`);
  }
});

check('planner builds a full plan from an empty state', () => {
  const p = W.makePlan(false);
  assert.ok(p.blocks.length >= 3);
  const mins = p.blocks.reduce((a, b) => a + b.min, 0);
  assert.equal(mins, p.len);
});

check('1–10 review scheduling', () => {
  W.review('sc:major:0', 2, 80);
  let st = W.state().items['sc:major:0'];
  assert.equal(st.int, 0); assert.equal(st.bpm, 68);
  W.review('sc:major:0', 10, 80);
  st = W.state().items['sc:major:0'];
  assert.ok(st.int >= 2); assert.equal(st.bpm, 86);
});

console.log(`\n${passed} checks passed`);
