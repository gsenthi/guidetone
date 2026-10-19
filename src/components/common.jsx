import {useEffect,useReducer,useRef} from 'react';
import {keyName,CYCLE5,SIG,TEX,chordsInKey} from '../theory/index.js';
import {state,save} from '../engine/store.js';
import {DNAME} from '../engine/catalogue.js';
import {Met,MODE_TEXT,metStart,metStop,currentBeat} from '../audio/metronome.js';
import {UI,render,getVersion} from '../ui.js';
import {rate} from '../session.js';

export const notesText=v=>v.map(n=>n.name).join(' ');
const isBlack=pc=>[1,3,6,8,10].includes(pc);
const KB_CSS='.kw{fill:var(--ivory);stroke:var(--line)}.kb{fill:var(--ebony)}.on{fill:var(--keyhi)}.kl{font:600 9px var(--f-mono);fill:var(--keylabel);text-anchor:middle}.kls{font-size:7px}.kc{font:500 7px var(--f-mono);fill:var(--muted);text-anchor:middle}';

/* Two octaves (or more) of keyboard from the C below the lowest note, with the notes highlighted and named. */
export function Keyboard({notes,cls}){const mids=notes.map(n=>n.midi);const lo=Math.min(...mids),hi=Math.max(...mids);const start=lo-((lo%12+12)%12);let end=start+24;while(end<=hi)end+=12;const W=20,H=84,BW=12,BH=52;const whites=[];for(let m=start;m<end;m++)if(!isBlack(m%12))whites.push(m);
  const on=new Map(notes.map(n=>[n.midi,n.name]));const wx={};const els=[];
  whites.forEach((m,i)=>{wx[m]=i*W;const o=on.has(m);els.push(<rect key={'w'+m} x={i*W+.5} y=".5" width={W-1} height={H} rx="3" className={'kw'+(o?' on':'')}/>);
    if(o)els.push(<text key={'l'+m} x={i*W+W/2} y={H-8} className="kl">{on.get(m)}</text>);else if(m%12===0)els.push(<text key={'c'+m} x={i*W+W/2} y={H-8} className="kc">{`C${Math.floor(m/12)-1}`}</text>);});
  for(let m=start;m<end;m++){if(!isBlack(m%12))continue;const x=wx[m-1]+W-BW/2;const o=on.has(m);els.push(<rect key={'b'+m} x={x} y=".5" width={BW} height={BH} rx="2" className={'kb'+(o?' on':'')}/>);if(o)els.push(<text key={'k'+m} x={x+BW/2} y={BH-7} className="kl kls">{on.get(m)}</text>);}
  const tw=whites.length*W+1;
  return <div className={'kb'+(cls?' '+cls:'')}><svg viewBox={`0 0 ${tw} ${H+1}`} role="img" aria-label={`Keyboard showing ${notes.map(n=>n.name).join(' ')}`}><style>{KB_CSS}</style>{els}</svg></div>;}

/* Collapsible section; whether it is open is remembered on the card. */
export function Fold({k,label,children}){const C=UI.card;
  return <details className="fold" open={!!C[k]} onToggle={e=>{C[k]=e.currentTarget.open;}}><summary>{label}</summary><div className="foldbody">{children}</div></details>;}

export function toggleName(id){const C=UI.card;C.nm=C.nm||new Set();C.nm.has(id)?C.nm.delete(id):C.nm.add(id);render();}
export const nameShown=id=>state.settings.showNames||UI.card.nm?.has(id);
export function NameTag({id,sym}){const open=nameShown(id);
  return <button type="button" className={'nametag'+(open?'':' hidden')} aria-label={open?sym:'Show chord name'} onClick={()=>{if(!state.settings.showNames)toggleName(id);}}>{open?sym:'name?'}</button>;}
export function NamesChip(){return <button className="chip" aria-pressed={String(!!state.settings.showNames)} onClick={()=>{state.settings.showNames=!state.settings.showNames;save();render();}}>Show all chord names</button>;}

/* Bars of Roman numerals; chord names stay hidden until tapped (or Settings shows them all). */
export function BarsView({bars,id='b',hide}){let i=0;
  return <div className="bars">{bars.map((bar,bi)=><div className="bar" key={bi}><span className="barno">{bi+1}</span>{bar.map((c,ci)=>{const nid=id+(i++);
    if(hide&&c.nw)return <div className="bc nw" key={ci}><span className="brn2">?</span><span className="bname hidden">·</span></div>;
    const open=nameShown(nid);
    return <button type="button" key={ci} className={'bc'+(c.nw?' nw':'')} aria-label={open?`${c.rn}, ${c.sym}`:`${c.rn}. Show chord name`} onClick={()=>{if(!state.settings.showNames)toggleName(nid);}}><span className="brn2">{c.rn}</span><span className={'bname'+(open?'':' hidden')}>{open?c.sym:'name?'}</span></button>;})}</div>)}</div>;}

export function VoicingFold({sf,sv,TL=TEX.filter(t=>t.k!=='guide')}){const C=UI.card;
  return <Fold k="kbOpen" label="Voicings on the keyboard">
    {TL.length<2?null:<div className="chips">{TL.map(t=><button key={t.k} className="chip" aria-pressed={String(C.tex===t.k)} onClick={()=>{C.tex=t.k;render();}}>{t.label}</button>)}</div>}
    <div className="kbgrid wide">{sf.map((c,i)=>{const v=sv[i];const txt=v.lh?`LH ${notesText(v.lh)} · RH ${notesText(v.rh)}`:C.tex==='rootless'?notesText(v):C.tex==='guide'?`${notesText(v)} over ${c.rootName}`:`${notesText(v)} · bass ${c.rootName}`;
      return <div key={i} className={'cc'+(c.nw?' nwc':'')}><div className="row" style={{gap:10,alignItems:'baseline'}}><span className="sym">{c.sym}</span><span className="rn">{c.rn}</span></div><div className="nn">{txt}</div><Keyboard notes={v}/></div>;})}</div>
  </Fold>;}

const ckLabel=pc=>pc===6?'F♯/G♭':keyName(pc,'maj');
export function CircleWidget({sel,mark,disabled,minors,onPick,center}){
  return <div className="circle">{CYCLE5.map((pc,i)=>{const a=(i/12)*2*Math.PI-Math.PI/2;const x=50+40.5*Math.cos(a),y=50+40.5*Math.sin(a),xi=50+26*Math.cos(a),yi=50+26*Math.sin(a);
    return [<button key={'k'+pc} type="button" className={'ck'+(sel===pc?' on':'')+(mark&&mark[pc]?' '+mark[pc]:'')+(pc===6?' small':'')} style={{left:`${x}%`,top:`${y}%`}} data-pc={pc} disabled={!!disabled} aria-label={keyName(pc,'maj')} onClick={()=>onPick&&onPick(pc)}>{ckLabel(pc)}</button>,
      minors===false?null:<span key={'m'+pc} className="cm" style={{left:`${xi}%`,top:`${yi}%`}} aria-hidden="true">{keyName((pc+9)%12,'min').toLowerCase()}</span>];})}
    <div className="ccenter">{center||''}</div></div>;}
export {ckLabel};

export function PathView({labels}){const C=UI.card;
  return <div className="path">{labels.map((l,i)=>{const open=i===0||C.pathAll||C.nm?.has('k'+i);
    return [i>0?<span key={'a'+i} className="arrow" aria-hidden="true">→</span>:null,<button key={'p'+i} type="button" className={'pchip'+(open?'':' hidden')} aria-label={open?l:`Step ${i+1}. Show it`} onClick={()=>{if(i>0&&!C.pathAll)toggleName('k'+i);}}>{open?l:'?'}</button>];})}</div>;}

export function ExplorerPanel({pc}){const dia=chordsInKey([['I',1,0,'maj7'],['ii',2,2,'m7'],['iii',3,4,'m7'],['IV',4,5,'maj7'],['V',5,7,'dom7'],['vi',6,9,'m7'],['viiø',7,11,'m7b5']],pc,'maj');
  return <div className="explore"><div className="row" style={{gap:'6px 16px',alignItems:'baseline'}}><span className="sym">{`${keyName(pc,'maj')} major`}</span><span className="muted">{`${SIG[pc]} · relative minor ${keyName((pc+9)%12,'min')}`}</span></div>
    <div className="dia">{dia.map((c,i)=><div key={i} className="bc"><span className="brn2">{c.rn}</span><span className="bname">{c.sym}</span></div>)}</div>
    <p className="hint">{`Clockwise (up a 5th, one more sharp): ${keyName((pc+7)%12,'maj')}, the V. Anticlockwise (down a 5th, the jazz direction): ${keyName((pc+5)%12,'maj')}, the IV. Directly opposite (a tritone away): ${keyName((pc+6)%12,'maj')}, which is where the tritone sub of ${keyName((pc+7)%12,'maj')}7 lives.`}</p></div>;}

/* The 1–10 score buttons. Tempo-ladder items pass the metronome's current bpm to the review. */
export function RateRow({it,bpm:bpmType,ladder,suggest,bpmVal}){const A=bpmType?['fell apart','a few slips','clean and relaxed']:ladder?['needed the answer','found it, not in time','in time, no hesitation']:['no idea','got there slowly','instant, no thought'];
  const useBpm=bpmType||ladder;
  return <div><div className="eyebrow" style={{marginBottom:8}}>How did it go? Score it 1 to 10</div>
    <div className="rate" role="group" aria-label="Score from 1 to 10">{Array.from({length:10},(_,i)=>{const n=i+1;return <button key={n} className={suggest===n?'suggest':undefined} style={{'--pct':`${Math.round(15+n*8.5)}%`}} aria-label={`${n} out of 10`} onClick={()=>rate(it,n,useBpm?Met.bpm:(bpmVal??null))}>{n}</button>;})}</div>
    <div className="anchors"><span>{`1 · ${A[0]}`}</span><span>{`5 · ${A[1]}`}</span><span>{`10 · ${A[2]}`}</span></div>
    {useBpm?<p className="ratenote">8 or more speeds the tempo up next time (+4, or +6 for a 10). 5 to 7 keeps it. 4 or less slows it down.</p>:<p className="ratenote">Lower scores bring it back sooner. 9s and 10s push it further away.</p>}</div>;}

function Lights(){const ref=useRef(null);
  useEffect(()=>{let raf;const loop=()=>{raf=requestAnimationFrame(loop);const L=ref.current;if(!L)return;if(!Met.on){[...L.children].forEach(i=>i.classList.remove('on'));return;}const beat=currentBeat();if(beat<0)return;[...L.children].forEach((i,ix)=>i.classList.toggle('on',ix===beat));};raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf);},[]);
  return <div className="lights" aria-hidden="true" ref={ref}><i/><i/><i/><i/></div>;}

/* Metronome strip. Each full re-render resets the tempo to the item's own (unless the click is running);
   the − / + / start buttons only redraw the strip, so a tempo you've nudged survives them. */
export function MetWidget({bpm,mode,showGuide}){const seen=useRef(null);const[,redraw]=useReducer(x=>x+1,0);
  if(seen.current!==getVersion()){seen.current=getVersion();if(!Met.on){Met.bpm=bpm;Met.mode=mode;}}
  const set=v=>{Met.bpm=Math.max(40,Math.min(260,v));redraw();};
  return <div className="met"><button className="btn sq" aria-label="Slower" onClick={()=>set(Met.bpm-4)}>−</button><div className="bpm"><small>BPM</small>{Met.bpm}</div><button className="btn sq" aria-label="Faster" onClick={()=>set(Met.bpm+4)}>+</button>
    <button className={'btn'+(Met.on?'':' primary')} onClick={()=>{Met.on?metStop():metStart();redraw();}}>{Met.on?'Stop':'Start click'}</button>
    <Lights/><div className="mode">{MODE_TEXT[mode]}</div>
    {showGuide?<button className="chip" aria-pressed={String(Met.guide)} onClick={()=>{Met.guide=!Met.guide;redraw();}}>{Met.guide?'Guide clicks on':'Guide clicks off'}</button>:null}</div>;}

export const itemBpm=(id,def)=>state.items[id]?.bpm??def;
export function LadderLine({id,def}){const st=state.items[id];return <p className="hint">{`Tempo ladder: start at ${itemBpm(id,def)} bpm. Best clean so far: ${st?.best?st.best+' bpm':'none yet'}. Rate honestly and the tempo moves for next time.`}</p>;}

export function CardShell({it,b,s,title,mid,children}){
  return <article className="card"><div><div className="eyebrow">{`${DNAME[b.d]} · ${s.ii+1} of ${b.items.length}`}</div><h2 className={'ctitle'+(mid?' mid':'')}>{title}</h2><div className={'why'+(it.isNew?' new':'')}>{it.why}</div></div>{children}</article>;}

export const Stats=({rows})=><div className="stats">{rows.map(([v,l],i)=><div key={i} className="stat"><b>{v}</b><span>{l}</span></div>)}</div>;
