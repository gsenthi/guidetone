// Regression checks for Guide Tone's theory engine and scheduler.
// Run with: npm test
import {describe,it,expect} from 'vitest';
import {QUAL,TECH,degLabel,scaleNotes,twoHand,barsInKey,voiceTexture} from '../src/theory/index.js';
import {state} from '../src/engine/store.js';
import {review} from '../src/engine/review.js';
import {makePlan} from '../src/engine/planner.js';

const names=v=>v.map(n=>n.name).join(' ');

describe('theory engine',()=>{
  it('scale spelling keeps one letter per degree',()=>{
    expect(names(scaleNotes('major',6))).toBe('G♭ A♭ B♭ C♭ D♭ E♭ F G♭');
    expect(names(scaleNotes('dorian',1))).toBe('C♯ D♯ E F♯ G♯ A♯ B C♯');
    expect(names(scaleNotes('bebopdom',1))).toBe('D♭ E♭ F G♭ A♭ B♭ C♭ C D♭');
  });

  it('extension degrees label correctly',()=>{
    expect(QUAL.alt.tones.map(degLabel).join(' ')).toBe('1 3 ♭7 ♭9 ♯9 ♯11 ♭13');
    expect(QUAL.dom13.tones.map(degLabel).join(' ')).toBe('1 3 5 ♭7 9 13');
  });

  it('two-hand chord voicing: root + guide tone in LH',()=>{
    const v=twoHand('dom13',1); // D♭13
    expect(names(v.lh)).toBe('D♭ C♭');
    expect(v.rh.every(n=>n.midi>=58),'RH sits above middle-C area').toBe(true);
  });

  it('reharm spellings avoid F♭/C♭ roots',()=>{
    const X=TECH.tt;
    expect(barsInKey(X.spice,3,X.mode).flat().map(c=>c.sym)).toEqual(['Fm7','E9♯11','E♭maj7','E♭maj7']);
    expect(barsInKey(TECH.ladybird.spice,3,'maj').flat().map(c=>c.sym)).toEqual(['E♭maj7','G♭maj7','Bmaj7','Emaj7','E♭maj7']);
  });

  it('every reharm technique has bar-aligned base and spice',()=>{
    for(const [k,X] of Object.entries(TECH))expect(X.base.length,k).toBe(X.spice.length);
  });

  it('guide-tone texture moves by step down the cycle',()=>{
    const roots=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
    const chain=[...Array(12)].map((_,i)=>{const pc=(5*i)%12;return{q:'dom7',root:roots[pc],rootName:roots[pc],pc};});
    const v=voiceTexture(chain,'guide');
    for(let i=1;i<v.length;i++){
      const move=Math.max(...v[i].map((n,j)=>Math.abs(n.midi-v[i-1][j].midi)));
      expect(move,`step ${i} moved ${move} semitones`).toBeLessThanOrEqual(2);
    }
  });
});

describe('scheduler',()=>{
  it('planner builds a full plan from an empty state',()=>{
    const p=makePlan(false);
    expect(p.blocks.length).toBeGreaterThanOrEqual(3);
    expect(p.blocks.reduce((a,b)=>a+b.min,0)).toBe(p.len);
  });

  it('1–10 review scheduling',()=>{
    review('sc:major:0',2,80);
    let st=state.items['sc:major:0'];
    expect(st.int).toBe(0);expect(st.bpm).toBe(68);
    review('sc:major:0',10,80);
    st=state.items['sc:major:0'];
    expect(st.int).toBeGreaterThanOrEqual(2);expect(st.bpm).toBe(86);
  });
});
