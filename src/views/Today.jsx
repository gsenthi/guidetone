import {keyName} from '../theory/index.js';
import {state,save} from '../engine/store.js';
import {ITEMS,DNAME,DSHORT} from '../engine/catalogue.js';
import {ensurePlan,makePlan} from '../engine/planner.js';
import {go,render,toast} from '../ui.js';
import {startSession} from '../session.js';

function KeyGlyph({pc}){const n=keyName(pc,'maj');return <div className="keyglyph">{n[0]}{n.length>1?<span className="acc">{n.slice(1)}</span>:null}</div>;}

/* The day's plan: key of the day, the timeline of blocks and the items in each. */
export function Today(){const p=ensurePlan(),s=state.session;
  return <>
    <section className="hero">
      <div><div className="eyebrow">Key of the day</div><KeyGlyph pc={p.key}/><div className="keysub">{`${keyName(p.key,'maj')} major · ${keyName((p.key+9)%12,'min')} minor`}</div><p className="keywhy">{p.keyWhy}</p></div>
      <div className="planhead"><div className="eyebrow">{new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</div>
        <h1>{`${p.len}-minute warm-up`}</h1>
        <div className="strip" role="img" aria-label="Session timeline">{p.blocks.map((b,i)=><div key={i} style={{flex:`${b.min} 1 0`}}><b>{`${b.min}′`}</b><span>{b.opener?'Opener':DSHORT[b.d]}</span></div>)}</div>
        <div className="row">{s?<button className="btn primary big" onClick={()=>go('session')}>Resume session</button>:<button className="btn primary big" onClick={startSession}>Start warm-up</button>}
          <button className="btn ghost" onClick={()=>{state.plan=makePlan(true,p.key);save();render();toast('Plan reshuffled');}}>Reshuffle</button>
          <div className="chips" role="group" aria-label="Session length">{[10,15,20,30].map(n=><button key={n} className="chip" aria-pressed={String(state.settings.len===n)} onClick={()=>{state.settings.len=n;state.plan=null;save();render();}}>{`${n} min`}</button>)}</div></div></div>
    </section>
    {s?<div className="banner"><span>{`Session in progress: block ${Math.min(s.bi+1,s.blocks.length)} of ${s.blocks.length}.`}</span><div className="row"><button className="btn" onClick={()=>go('session')}>Resume</button><button className="btn ghost" onClick={()=>{state.session=null;save();render();}}>Discard</button></div></div>:null}
    <div className="blocks">{p.blocks.map((b,i)=><article key={i} className="block"><div className="bmin">{`${b.min}′`}<small>{`block ${i+1}`}</small></div>
      <div><h3>{b.opener?'Opener: circle recall':DNAME[b.d]}</h3><p className="bwhy">{b.why}</p><ul className="items">{b.items.map((it,j)=><li key={j}><b>{ITEMS[it.id].label}</b><span className={'tag'+(it.isNew?' new':'')}>{it.why}</span></li>)}</ul></div></article>)}</div>
    <p className="hint" style={{marginTop:14}}>The plan rebuilds each day from what’s due, what you’ve found hard, and which areas you’ve been neglecting. Your ratings in the session feed tomorrow’s plan.</p>
  </>;}
