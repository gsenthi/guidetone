import {spell,placeList,asciiName} from './notes.js';
import {QUAL} from './qual.js';

export function closedSets(root,list,targets){const out=[];const pcs=list.map(([d,se])=>spell(root,d,se).pc);for(let k=0;k<list.length;k++){const ord=list.map((x,i)=>[x,((pcs[i]-pcs[k])%12+12)%12]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);targets.forEach(t=>out.push(placeList(root,ord,t)));}return out;}
export const span=v=>v[v.length-1].midi-v[0].midi;
export function guideOf(q){const Q=QUAL[q];return{g7:Q.tones.find(x=>x[0]===7)||Q.tones.find(x=>x[0]===6),g3:Q.tones.find(x=>x[0]===3||x[0]===4)};}
export function rhRest(q,g){const Q=QUAL[q];const not=x=>x[0]!==1&&!(x[0]===g[0]&&x[1]===g[1]);let r=Q.tones.filter(not);if(r.length>3)r=r.filter(x=>!(x[0]===5&&x[1]===7));if(r.length>4)r=Q.four.filter(not);return r;}
export function twoHand(q,pc){const Q=QUAL[q],root=asciiName(pc,Q.mode);const{g7,g3}=guideOf(q);const g=g7||g3;const lh=placeList(root,[[1,0],g],45);
  const c=closedSets(root,rhRest(q,g),[60,62,64,66]).filter(v=>v[0].midi>=58);c.sort((a,b)=>span(a)-span(b)||Math.abs(a[0].midi-62)-Math.abs(b[0].midi-62));return{lh,rh:c[0]};}
export function rootlessSet(q){const f=QUAL[q].four;if(f.some(x=>x[0]===1)&&!['m7b5','dim7'].includes(q))return f.map(x=>x[0]===1?[9,2]:x);return f;}
export function textureCands(c,tex){const Q=QUAL[c.q];let out;
  if(tex==='guide'){const{g7,g3}=guideOf(c.q);const all=closedSets(c.root,[g3,g7],[53,56,59,62,65,68]);out=all.filter(v=>v[0].midi>=50&&v[1].midi<=72);return out.length?out:all;}
  if(tex==='rootless'){const all=closedSets(c.root,rootlessSet(c.q),[49,52,55,58]);out=all.filter(v=>v[0].midi>=48&&v[v.length-1].midi<=72);if(!out.length)out=all;return out;}
  if(tex==='drop2'||tex==='drop3'){const w=tex==='drop2'?2:3;const all=closedSets(c.root,Q.four,[58,62,66,70]).map(v=>{const n=v.map(x=>({...x}));n[n.length-w].midi-=12;return n.sort((a,b)=>a.midi-b.midi);});out=all.filter(v=>v[v.length-1].midi>=65&&v[v.length-1].midi<=79&&v[0].midi>=46);if(!out.length)out=all;return out;}
  const{g7,g3}=guideOf(c.q);out=[];[g7,g3].filter(Boolean).forEach(g=>{const lh=placeList(c.root,[[1,0],g],44);closedSets(c.root,rhRest(c.q,g),[58,61,64,67]).forEach(rh=>{if(rh[0].midi<=lh[1].midi||span(rh)>12)return;const v=[...lh,...rh];v.lh=lh;v.rh=rh;out.push(v);});});return out;}
export function vlCost(a,b){const A=a.map(x=>x.midi).sort((x,y)=>x-y),B=b.map(x=>x.midi).sort((x,y)=>x-y);let c=0;const n=Math.min(A.length,B.length);for(let j=1;j<=n;j++)c+=Math.abs(A[A.length-j]-B[B.length-j])*(j===1?1.6:1);return c;}
export const TEX=[{k:'guide',label:'3rds & 7ths'},{k:'shells',label:'Shell + colour'},{k:'rootless',label:'Rootless (LH)'},{k:'drop2',label:'Drop 2'},{k:'drop3',label:'Drop 3'}];
export function voiceTexture(chords,tex){const TOP={guide:70,rootless:64,drop2:74,drop3:74,shells:72}[tex];let prev=null;return chords.map(c=>{let best=null;for(const v of textureCands(c,tex)){const top=v[v.length-1].midi;let cost=(prev?vlCost(v,prev):0)+Math.abs(top-TOP)*(prev?(tex==='guide'?.02:.25):2);if(!best||cost<best.cost)best={v,cost};}prev=best.v;return best.v;});}
