import {state,save} from './store.js';
import {ITEMS,CURR} from './catalogue.js';
import {dayNum} from './dates.js';

export function review(id,r,bpmUsed){const today=dayNum();const st=state.items[id]||{n:0,ease:2.3,int:0,hist:[]};
  st.n++;st.hist=[...st.hist,r].slice(-8);st.last=today;
  if(r<=3){st.int=0;st.ease=Math.max(1.3,st.ease-.2);}
  else if(r<=6){st.int=Math.max(1,Math.round(st.int*(r===4?1:1.2)));st.ease=Math.max(1.3,st.ease-(r===4?.1:.05));}
  else{const f={7:.8,8:1,9:1.15,10:1.3}[r];st.int=st.int<1?(r>=9?3:2):Math.max(st.int+1,Math.round(st.int*st.ease*f));st.ease=Math.min(3,st.ease+(r-7)*.03);}
  st.due=today+st.int;
  if(bpmUsed!=null){st.bpm=r>=10?Math.min(260,bpmUsed+6):r>=8?Math.min(260,bpmUsed+4):r>=5?bpmUsed:Math.max(40,bpmUsed-(r<=2?12:8));if(r>=8)st.best=Math.max(st.best||0,bpmUsed);}
  state.items[id]=st;state.domainLast[ITEMS[id].domain]=today;save();}
export const dueCount=(d,today)=>CURR[d].filter(id=>state.items[id]&&state.items[id].due<=today).length;
