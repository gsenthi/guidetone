import {TECH} from '../theory/index.js';
import {MIX_POOL,MIX_NEED} from './catalogue.js';
import {state} from './store.js';
import {sv,mastery} from './scores.js';

/* The mixed reharm unlocks once MIX_NEED techniques are solid (7+ at least twice, mastery ≥ 0.6, in any key). */
export function learntTechs(){return MIX_POOL.filter(t=>{for(let pc=0;pc<12;pc++){const st=state.items[`rx:${t}:${pc}`];if(st&&st.hist.filter(x=>sv(x)>=7).length>=2&&mastery(st)>=.6)return true;}return false;});}
export const mixUnlocked=()=>learntTechs().length>=MIX_NEED;
export function pickMixTechs(){let L=learntTechs();if(L.length<3)L=MIX_POOL.slice(0,4);L=L.slice().sort(()=>Math.random()-.5);const out=[],fams=new Set();for(const t of L){if(out.length<3&&!fams.has(TECH[t].fam)){out.push(t);fams.add(TECH[t].fam);}}for(const t of L){if(out.length<3&&!out.includes(t))out.push(t);}return out;}
