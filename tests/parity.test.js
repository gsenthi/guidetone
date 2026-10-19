// Checks the ported modules against the original single-file prototype (prototype/index.html),
// so the port keeps exactly the same spellings, voicings, curricula and scheduling.
import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {QUAL,TECH,SCALE,PAT,TEX,barsInKey,twoHand,voiceTexture,scaleNotes,patternGroups} from '../src/theory/index.js';
import {ITEMS,CURR} from '../src/engine/catalogue.js';
import {state,setState,defaults} from '../src/engine/store.js';
import {review} from '../src/engine/review.js';
import {makePlan} from '../src/engine/planner.js';
import {evalTaps} from '../src/engine/reading.js';

const html=readFileSync(new URL('../prototype/index.html',import.meta.url),'utf8');
const ctx={console,performance,Math,Date,JSON};ctx.globalThis=ctx;
vm.createContext(ctx);vm.runInContext(html.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
const W=ctx.__WS;
const plain=x=>JSON.parse(JSON.stringify(x));
const same=(a,b)=>expect(plain(a)).toEqual(plain(b));
const KEYS=[...Array(12).keys()];

describe('port matches the prototype',()=>{
  it('items and curricula',()=>{same(ITEMS,W.ITEMS);same(CURR,W.CURR);});

  it('chord spellings and two-hand voicings',()=>{for(const q in QUAL)for(const pc of KEYS)same(twoHand(q,pc),W.twoHand(q,pc));});

  it('reharm bars and voice-leading in every texture',()=>{
    for(const t in TECH)for(const pc of KEYS){const X=TECH[t];
      for(const part of ['base','spice']){const mine=barsInKey(X[part],pc,X.mode);same(mine,W.barsInKey(W.TECH[t][part],pc,X.mode));
        for(const {k} of TEX)same(voiceTexture(mine.flat(),k),W.voiceTexture(mine.flat(),k));}}
  });

  it('scales and patterns',()=>{
    for(const s in SCALE)for(const pc of KEYS)same(scaleNotes(s,pc),W.scaleNotes(s,pc));
    for(const p in PAT)for(const pc of KEYS)same(patternGroups(p,pc),W.patternGroups(p,pc));
  });

  it('rhythm-reading scoring',()=>{
    const exp=[1,1.5,2,2.75,3.5],taps=[0.98,1.53,2.2,2.74,3.1,3.52];
    same(evalTaps(exp,taps,96,1,.625,2),W.evalTaps(exp,taps,96,1,.625,2));
  });

  it('daily plans after the same run of reviews',()=>{
    setState(defaults());W.setState(plain(defaults()));
    same(makePlan(false),W.makePlan(false));
    // A deterministic pseudo-random run of ratings across the catalogue.
    let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
    const ids=Object.keys(ITEMS);
    for(let round=0;round<40;round++){
      for(let n=0;n<8;n++){const id=ids[Math.floor(rnd()*ids.length)],r=1+Math.floor(rnd()*10),bpm=rnd()<.5?60+Math.floor(rnd()*80):null;review(id,r,bpm);W.review(id,r,bpm);}
      same(state.items,W.state().items);
      for(const len of [10,15,20,30]){state.settings.len=len;W.state().settings.len=len;same(makePlan(false),W.makePlan(false));}
    }
  });
});
