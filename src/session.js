import {state,save} from './engine/store.js';
import {ITEMS,PER} from './engine/catalogue.js';
import {review} from './engine/review.js';
import {ensurePlan} from './engine/planner.js';
import {dayNum,ymd} from './engine/dates.js';
import {metStop} from './audio/metronome.js';
import {stopPlayback} from './audio/synth.js';
import {UI,go,render,wakeOn,wakeOff} from './ui.js';

/* Running a session: the day's plan, or an ad-hoc drill started from the library. */
export const cur=()=>UI.adhoc||state.session;
export function startSession(){const p=ensurePlan();state.keyFocus[p.key]=dayNum();state.session={blocks:JSON.parse(JSON.stringify(p.blocks)),bi:0,ii:0,start:Date.now(),blockStart:Date.now(),res:[],key:p.key};UI.adhoc=null;save();wakeOn();go('session');}
export function startAdhoc(ids,title){const d=ITEMS[ids[0]].domain;UI.adhoc={adhoc:true,title,blocks:[{d,min:Math.max(2,Math.round(ids.length*PER[d])),why:'',items:ids.map(id=>({id,why:'Chosen from the library',isNew:!state.items[id]}))}],bi:0,ii:0,start:Date.now(),blockStart:Date.now(),res:[],key:ITEMS[ids[0]].key??0};wakeOn();go('session');}
export function nextBlock(){const s=cur();metStop();stopPlayback();s.bi++;s.ii=0;s.blockStart=Date.now();if(!s.adhoc)save();if(s.bi>=s.blocks.length)finish();else render();}
export function finish(){metStop();stopPlayback();wakeOff();const s=cur();if(!s){go('today');return;}
  const mins=Math.max(1,Math.round((Date.now()-s.start)/60000));
  if(!s.adhoc&&s.res.length){state.log.push({d:ymd(),min:mins,n:s.res.length});state.log=state.log.slice(-500);}
  UI.summary={res:s.res,mins,adhoc:!!s.adhoc};if(s.adhoc)UI.adhoc=null;else state.session=null;save();go('summary');}
export function rate(it,r,bpm){const s=cur();metStop();stopPlayback();review(it.id,r,bpm);s.res.push({id:it.id,r,bpm});s.ii++;if(!s.adhoc)save();render();}
