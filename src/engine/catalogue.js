import {QUAL,TECH,SCALE,PAT,RH,READ,CYC,keyName,ORDER_INTRO} from '../theory/index.js';

/* Every practice item, the per-domain curricula (CURR) and the items in each key. */
export const DOMS=['rhythm','circle','scales','patterns','chords','progressions'];
export const DNAME={rhythm:'Rhythm & time',circle:'Circle of 5ths',scales:'Scales & speed',patterns:'Patterns & lines',chords:'Chords & extensions',progressions:'Reharmonisation'};
export const DSHORT={rhythm:'Rhythm',circle:'Circle',scales:'Scales',patterns:'Patterns',chords:'Chords',progressions:'Reharm'};
export const PER={circle:2,chords:0.75,progressions:2.5,scales:1.5,patterns:2,rhythm:1.5};
export const START_BPM={scales:72,patterns:84,progressions:80};
export const ITEMS={},CURR={circle:[],rhythm:[],scales:[],patterns:[],chords:[],progressions:[]},KEY_ITEMS=Array.from({length:12},()=>[]);
export function add(it){ITEMS[it.id]=it;if(it.key!=null)KEY_ITEMS[it.key].push(it.id);}
for(const q in QUAL)for(let pc=0;pc<12;pc++)add({id:`ch:${q}:${pc}`,domain:'chords',type:'chord',sub:q,key:pc,label:keyName(pc,QUAL[q].mode)+QUAL[q].sym});
for(const t in TECH)for(let pc=0;pc<12;pc++)add({id:`rx:${t}:${pc}`,domain:'progressions',type:'reharm',sub:t,key:pc,label:`${TECH[t].name} · ${keyName(pc,TECH[t].mode)}${TECH[t].mode==='min'?' minor':''}`});
for(const s in SCALE)for(let pc=0;pc<12;pc++)add({id:`sc:${s}:${pc}`,domain:'scales',type:'scale',sub:s,key:pc,label:`${keyName(pc,SCALE[s].set)} ${SCALE[s].name}`});
for(const p in PAT)for(let pc=0;pc<12;pc++)add({id:`pt:${p}:${pc}`,domain:'patterns',type:'pattern',sub:p,key:pc,label:`${PAT[p].name} · ii–V–I in ${keyName(pc,'maj')}`});
for(const r in RH)add({id:`rh:${r}`,domain:'rhythm',type:RH[r].kind,sub:r,key:null,label:RH[r].name});
READ.forEach((r,i)=>add({id:`rd:${i}`,domain:'rhythm',type:'read',sub:i,key:null,label:r.name?`Reading: ${r.name}`:`Reading ${i+1} · level ${r.lvl}`}));
export const PFXS={chords:'ch',progressions:'rx',scales:'sc',patterns:'pt',circle:'cy'};
export const stage=(d,subs)=>ORDER_INTRO.forEach(pc=>subs.forEach(x=>CURR[d].push(`${PFXS[d]}:${x}:${pc}`)));
export function diag(d,stages,groups){for(let sum=0;sum<stages.length+groups.length;sum++)for(let g=0;g<groups.length;g++){const st=stages[sum-g];if(!st)continue;st.forEach(x=>groups[g].forEach(pc=>CURR[d].push(`${PFXS[d]}:${x}:${pc}`)));}}
diag('chords',[['maj7','m7','dom7'],['maj9','m9','dom9','69'],['dom13','sus7','m7b5','dom7b9'],['m11','sus9','dom7s9','alt','m6'],['maj7s11','dom9s11','sus13','dom13b9','mmaj7','m69','m9b5','dim7','dom7b13']],[[0,5,7,10],[2,3,9,8],[4,1,11,6]]);
for(let pc=0;pc<12;pc++)add({id:`rx:mix:${pc}`,domain:'progressions',type:'mix',sub:'mix',key:pc,label:`Mixed reharm · ${keyName(pc,'maj')}`});
diag('progressions',[['ext','sus','alt','tt'],['secdom','backdoor','miniv','minor'],['alldom','subii','ttturn','cycle'],['relii','dim','chromii','above'],['below','ladybird','coltrane']],[[0,5],[7,10],[2,3],[9,8],[4,1],[11,6]]);
for(const c in CYC)for(let pc=0;pc<12;pc++)add({id:`cy:${c}:${pc}`,domain:'circle',type:'cycle',sub:c,key:pc,label:`${CYC[c].name} · ${keyName(pc,CYC[c].mode)}${CYC[c].mode==='min'?' minor':''}`});
add({id:'cy:quiz',domain:'circle',type:'quiz',sub:'quiz',key:null,label:'Circle recall · 60 seconds'});
diag('circle',[['dom7','diatmaj'],['guide','iiV'],['diatmin','bdiiV']],[[0,5,7,10],[2,3,9,8],[4,1,11,6]]);
ORDER_INTRO.forEach(pc=>CURR.progressions.push(`rx:mix:${pc}`));
export const MIX_POOL=Object.keys(TECH).filter(k=>TECH[k].mode==='maj');
export const MIX_NEED=4;
export function buildMix(techs){const segs=[];let base=[],spice=[];techs.forEach((t,si)=>{const X=TECH[t];let b=X.base.slice(),sp=X.spice.slice();if(si<techs.length-1&&b.length>2&&JSON.stringify(b[b.length-1])===JSON.stringify(b[b.length-2])){b=b.slice(0,-1);sp=sp.slice(0,-1);}segs.push({t,from:base.length+1,to:base.length+b.length});base=base.concat(b);spice=spice.concat(sp);});return{segs,base,spice};}
stage('scales',['major']);stage('scales',['dorian','mixolydian']);stage('scales',['majpent','minpent']);stage('scales',['blues','bebopdom']);stage('scales',['melmin','bebopmaj']);stage('scales',['altered','lyddom']);stage('scales',['dimhw','harmmin']);
stage('patterns',['p1235','p1357']);stage('patterns',['p5321','penc']);stage('patterns',['p3579']);
CURR.rhythm=['rd:0','rh:tf24','rd:1','rh:sd83','rd:2','rh:sdsw','rd:3','rh:tfgap','rd:4','rd:5','rh:tf4','rh:sdlad','rd:6','rd:7','rh:sd32','rh:tfbar2','rd:8','rd:9','rh:sd34','rh:tfand4','rd:10','rd:11','rd:12','rd:13','rd:14'];

export const LIB_SUBS={circle:Object.entries(CYC).map(([k,v])=>[k,v.name]),chords:Object.entries(QUAL).map(([k,v])=>[k,v.name]),progressions:[...Object.entries(TECH).map(([k,v])=>[k,v.name]),['mix','Mixed reharm']],scales:Object.entries(SCALE).map(([k,v])=>[k,v.name]),patterns:Object.entries(PAT).map(([k,v])=>[k,v.name])};
export const subMode=(d,sub)=>d==='circle'?CYC[sub].mode:d==='chords'?QUAL[sub].mode:d==='progressions'?(TECH[sub]?.mode||'maj'):d==='scales'?SCALE[sub].set:'maj';
