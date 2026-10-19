import {ITEMS} from './catalogue.js';
import {sv} from './scores.js';

/* Progress lives in localStorage under guidetone.v1, falling back to the prototype's woodshed.v1 key. */
export const LS='guidetone.v1',LS_OLD='woodshed.v1';
export const defaults=()=>({v:1,items:{},log:[],keyFocus:{},domainLast:{},plan:null,session:null,settings:{len:15,w:{rhythm:1,circle:1.2,scales:1,patterns:0.8,chords:1,progressions:1},newPer:1,swing:true,metVol:0.8,tapOffset:0,showNames:false,opener:true}});
export function merge(s){const d=defaults();if(!s||typeof s!=='object')return d;const S=s.settings||{};return{...d,...s,items:s.items||{},log:s.log||[],keyFocus:s.keyFocus||{},domainLast:s.domainLast||{},settings:{...d.settings,...S,w:{...d.settings.w,...(S.w||{})}}};}
export let state=defaults();
export function setState(s){state=s;}
export function load(){let s=null;try{s=JSON.parse(localStorage.getItem(LS)||localStorage.getItem(LS_OLD));}catch(e){}state=merge(s);for(const k in state.items){const st=state.items[k];if(st&&st.hist)st.hist=st.hist.map(sv);}const bad=x=>x&&x.blocks&&x.blocks.some(b=>b.items.some(i=>!ITEMS[i.id]));if(bad(state.plan))state.plan=null;if(bad(state.session))state.session=null;}
export function save(){try{localStorage.setItem(LS,JSON.stringify(state));}catch(e){}}
