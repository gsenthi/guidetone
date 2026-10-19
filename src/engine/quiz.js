import {CYCLE5,QZ} from '../theory/index.js';
import {state,save} from './store.js';
import {avg} from './dates.js';

/* Circle recall: keys you get wrong are weighted to come up more often. */
export function quizNext(Q){const err=state.quizKeyErr||{};const ws=CYCLE5.map(pc=>1+Math.min(4,err[pc]||0));const tot=ws.reduce((a,b)=>a+b,0);let r=Math.random()*tot,k=CYCLE5[0];for(let i=0;i<12;i++){r-=ws[i];if(r<=0){k=CYCLE5[i];break;}}
  let z;do{z=QZ[Math.floor(Math.random()*QZ.length)];}while(Q.cur&&(z.c===Q.cur.c&&QZ.length>1||(Q.cur.k===k&&Math.random()<.7)));
  Q.cur={c:z.c,k,text:z.t(k),a:((z.a(k)%12)+12)%12,t0:performance.now()};}
export function quizRecord(c,pc,ms){const ok=pc===c.a;
  const err=state.quizKeyErr=state.quizKeyErr||{};err[c.k]=ok?Math.max(0,(err[c.k]||0)-.5):(err[c.k]||0)+1;
  const st=state.quizStats=state.quizStats||{};const s=st[c.c]=st[c.c]||{n:0,ok:0,ms:0};s.n++;if(ok)s.ok++;s.ms+=ms;save();return ok;}
export function quizSummary(log){const n=log.length,ok=log.filter(x=>x.ok).length,av=n?avg(log.map(x=>x.ms)):0;
  return{sum:{n,ok,av},suggest:n?Math.max(1,Math.min(10,Math.round((ok/n)*8+(av<2000?2:av<3500?1:0)-(n<6?2:0)))):1};}
