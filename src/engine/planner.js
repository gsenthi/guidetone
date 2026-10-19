import {CYCLE4} from '../theory/index.js';
import {state,save} from './store.js';
import {ITEMS,CURR,KEY_ITEMS,DOMS,PER} from './catalogue.js';
import {sv,mastery,toScore} from './scores.js';
import {ymd,dayNum,avg} from './dates.js';
import {dueCount} from './review.js';
import {mixUnlocked} from './mix.js';

/* Daily planner: key of the day, domain blocks for the session length, then items within each block. */
export function pickKey(today){let best=null;CYCLE4.forEach(pc=>{const ids=KEY_ITEMS[pc].filter(id=>state.items[id]);const ms=ids.map(id=>mastery(state.items[id])).filter(x=>x!=null);const m=ms.length?avg(ms):.5;const lf=state.keyFocus[pc];const since=lf==null?99:today-lf;const score=(1-m)*2+Math.min(since,12)/4;
  if(!best||score>best.score+1e-9){let why;if(!ms.length)why='Next round the cycle of 4ths. You haven’t practised in this key yet.';else if(m<.55)why=`Your weakest key right now: averaging ${toScore(m)}/10 across everything you’ve tried in it.`;else why=since>=99?'Not a focus key yet.':`Last focus key ${since} day${since===1?'':'s'} ago.`;best={pc,score,why};}});return best;}
export function nextNew(d,key,exclude,k){const c=CURR[d].filter(id=>!state.items[id]&&!exclude.has(id)&&!id.startsWith('rx:mix'));const out=[];while(out.length<k&&c.length){const win=c.slice(0,6);const pick=win.find(id=>ITEMS[id].key===key)||win[0];out.push(pick);c.splice(c.indexOf(pick),1);}return out;}
export function pickItems(d,n,key,exclude,jitter){const today=dayNum(),S=state.settings;
  const sc=CURR[d].filter(id=>state.items[id]&&!exclude.has(id)).map(id=>{const st=state.items[id],it=ITEMS[id];const m=mastery(st)??.5;const od=today-st.due;let p,why;
    if(od>=0){p=10+Math.min(od,10)+(1-m)*6;why=od>0?`Overdue by ${od} day${od>1?'s':''}`:'Due today';}
    else{p=(1-m)*4-Math.min(-od,10)*.3;why=m<.5?`Averaging ${toScore(m)}/10`:'Extra reinforcement';}
    const last=sv(st.hist[st.hist.length-1]);if(last<=3){p+=3;why=`Scored ${last}/10 last time`;}else if(last<=6&&od>=0)why=`Scored ${last}/10 last time`;
    if(it.key===key){p+=4;why+=' · today’s key';}if(jitter)p+=Math.random()*2.5;return{id,p,why};}).sort((a,b)=>b.p-a.p);
  const picks=[];for(const x of sc){if(picks.length>=n||x.p<8)break;picks.push(x);}
  const intro=CURR[d].filter(id=>state.items[id]).length;let room=n-picks.length;
  const allow=intro<6?room:Math.min(S.newPer,room);const taken=()=>new Set([...exclude,...picks.map(p=>p.id)]);
  nextNew(d,key,taken(),allow).forEach(id=>picks.push({id,why:'New · next in your curriculum',isNew:true}));
  for(const x of sc){if(picks.length>=n)break;if(!picks.some(p=>p.id===x.id))picks.push(x);}
  if(picks.length<n)nextNew(d,key,taken(),n-picks.length).forEach(id=>picks.push({id,why:'New · next in your curriculum',isNew:true}));
  if(d==='progressions'&&mixUnlocked()){const mid=`rx:mix:${key}`;const st=state.items[mid];if(!picks.some(p=>p.id===mid)&&!exclude.has(mid)&&(!st||st.due<=today)){const any=Object.keys(state.items).some(x=>x.startsWith('rx:mix'));const e={id:mid,why:any?'Mixed reharm in today’s key':'Unlocked: mixed reharm',isNew:!st};if(picks.length>=2)picks[picks.length-1]=e;else if(!any||today%2===0)picks[0]=e;}}
  return picks.map(({id,why,isNew})=>({id,why,isNew:!!isNew}));}
export function makePlan(jitter,keepKey){const S=state.settings,today=dayNum();const k=keepKey!=null?{pc:keepKey,why:state.plan?.keyWhy||''}:pickKey(today);
  const n={10:3,15:4,20:4,30:5}[S.len]||4;
  let sc=DOMS.map(d=>{const w=+S.w[d]||0;const last=state.domainLast[d];const since=last==null?null:today-last;const due=dueCount(d,today);let score=w*(1+Math.min(since??5,14)/2)*(1+Math.min(due,10)/10);if(jitter)score*=.7+Math.random()*.6;return{d,w,score,since,due};}).filter(x=>x.w>0).sort((a,b)=>b.score-a.score).slice(0,n);
  if(!sc.length)sc=[{d:'rhythm',w:1,score:1,since:null,due:0}];
  const opener=S.opener!==false;const total=opener?S.len-1:S.len;const base=Math.floor(total/sc.length);let rem=total-base*sc.length;sc.forEach(x=>{x.min=base+(rem>0?1:0);rem--;});
  sc.sort((a,b)=>DOMS.indexOf(a.d)-DOMS.indexOf(b.d));
  const blocks=sc.map(x=>{const count=Math.max(1,Math.round(x.min/PER[x.d]));let why;
    if(x.since==null)why='New area. Starting gently with the first items.';else if(x.since>=3)why=`Not practised for ${x.since} days.`;else if(x.due>0)why=`${x.due} item${x.due>1?'s':''} due for review.`;else why='Keeping it in rotation.';
    return{d:x.d,min:x.min,why,items:pickItems(x.d,count,k.pc,new Set(),jitter)};});
  if(opener)blocks.unshift({d:'circle',min:1,opener:true,why:'Sixty seconds of circle-of-5ths recall to wake up your ears and your theory.',items:[{id:'cy:quiz',why:'Every session · keys you miss come up more',isNew:!state.items['cy:quiz']}]});
  return{date:ymd(),len:S.len,key:k.pc,keyWhy:k.why,blocks};}
export function ensurePlan(){if(!state.plan||state.plan.date!==ymd()||state.plan.len!==state.settings.len||(state.settings.opener!==false)!==!!state.plan.blocks[0]?.opener){state.plan=makePlan(false);save();}return state.plan;}
