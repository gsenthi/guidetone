import {useEffect,useReducer} from 'react';
import {state,save} from '../engine/store.js';
import {ITEMS,DNAME,DSHORT} from '../engine/catalogue.js';
import {pickItems} from '../engine/planner.js';
import {sv,sBand} from '../engine/scores.js';
import {dayNum,pad2} from '../engine/dates.js';
import {metStop} from '../audio/metronome.js';
import {stopPlayback} from '../audio/synth.js';
import {UI,go,render,toast} from '../ui.js';
import {cur,nextBlock,finish} from '../session.js';
import {ItemCard} from '../components/cards/ItemCard.jsx';
import {Stats} from '../components/common.jsx';

/* Time left in the block, counting into overtime. */
function BlockClock({b,s}){const[,tick]=useReducer(x=>x+1,0);useEffect(()=>{const iv=setInterval(tick,500);return()=>clearInterval(iv);},[]);
  const left=b.min*60-(Date.now()-s.blockStart)/1000;const a=Math.abs(Math.round(left));
  return <div className={'clock'+(left<0?' over':'')} id="clock"><small>{left<0?'Over time':'Block time left'}</small>{`${left<0?'+':''}${Math.floor(a/60)}:${pad2(a%60)}`}</div>;}

function BlockDone({s,b}){const left=b.min*60-(Date.now()-s.blockStart)/1000;const last=s.bi>=s.blocks.length-1;
  return <div className="card done-panel"><div className="eyebrow">{DNAME[b.d]}</div><h2 className="ctitle mid">Block done</h2>
    <p className="instr">{left>45?`You have about ${Math.round(left/60)||1} minute${Math.round(left/60)>1?'s':''} left in this block. Take another item, or move on.`:s.adhoc?'That’s everything you picked.':'Time to move on.'}</p>
    <div className="row">{s.adhoc?<button className="btn primary" onClick={finish}>Finish</button>:<button className="btn primary" onClick={nextBlock}>{last?'Finish session':'Next block →'}</button>}
      {!s.adhoc?<button className="btn" onClick={()=>{const ex=new Set(b.items.map(x=>x.id));const more=pickItems(b.d,1,s.key,ex,false);if(more.length){b.items.push(...more);save();render();}else toast('Nothing else to add here');}}>One more item</button>:null}</div></div>;}

export function Session(){const s=cur();
  useEffect(()=>{if(!s)go('today');else if(s.bi>=s.blocks.length)finish();});
  if(!s||s.bi>=s.blocks.length)return null;
  const b=s.blocks[s.bi],it=b.items[s.ii];
  /* A new item gets fresh card state, and the click and any playback stop. */
  if(it&&UI.cardId!==`${s.bi}:${s.ii}:${it.id}`){UI.cardId=`${s.bi}:${s.ii}:${it.id}`;UI.card={};UI.read={phase:'idle'};metStop();stopPlayback();}
  return <>
    <div className="runhead">
      <div className="steps">{s.adhoc?<span className="step on">{s.title||'Library drill'}</span>:s.blocks.map((x,i)=><span key={i} className={'step'+(i===s.bi?' on':i<s.bi?' done':'')}>{`${x.opener?'Opener':DSHORT[x.d]} ${x.min}′`}</span>)}</div>
      <div className="row">{s.adhoc?null:<BlockClock key={s.bi} b={b} s={s}/>}{!s.adhoc&&s.bi<s.blocks.length-1?<button className="btn" onClick={nextBlock}>Next block →</button>:null}<button className="btn ghost" onClick={finish}>{s.adhoc?'Done':'End session'}</button></div>
    </div>
    {!it?<BlockDone s={s} b={b}/>:<ItemCard key={UI.cardId} it={it} b={b} s={s}/>}
  </>;}

export function Summary(){const S=UI.summary||{res:[],mins:0};const sc=S.res.map(r=>sv(r.r));const av=sc.length?(sc.reduce((a,b)=>a+b,0)/sc.length):0;
  return <>
    <section className="hero" style={{gridTemplateColumns:'1fr'}}><div><div className="eyebrow">{S.adhoc?'Drill finished':'Session finished'}</div><h1 className="ctitle">{S.res.length?`${S.res.length} item${S.res.length>1?'s':''} in ${S.mins} min`:'Nothing rated'}</h1>
      {S.res.length?<Stats rows={[[av.toFixed(1),'average out of 10'],[sc.filter(x=>x>=8).length,'scored 8 or more'],[sc.filter(x=>x<=4).length,'scored 4 or less']]}/>:null}</div></section>
    {S.res.length?<table className="rh"><thead><tr><th>Item</th><th>Score</th><th>Next</th></tr></thead><tbody>{S.res.map((r,i)=>{const st=state.items[r.id];const due=st?st.due-dayNum():0;const x=sv(r.r);
      return <tr key={i}><td>{ITEMS[r.id].label}</td><td className="num"><span className={'dot '+sBand(x)}/>{` ${x}/10`}{r.bpm?` · ${r.bpm} bpm`:''}</td><td className="num">{due<=0?'next session':due===1?'tomorrow':`in ${due} days`}</td></tr>;})}</tbody></table>:null}
    <div className="row" style={{marginTop:18}}><button className="btn primary" onClick={()=>go('today')}>Back to today</button><button className="btn" onClick={()=>go('progress')}>See progress</button></div>
  </>;}
