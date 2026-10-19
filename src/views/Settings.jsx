import {useReducer,useRef} from 'react';
import {state,setState,save,defaults,merge} from '../engine/store.js';
import {DOMS,DNAME} from '../engine/catalogue.js';
import {UI,render,toast} from '../ui.js';

/* A range slider whose readout updates as you drag; the change is saved straight away. */
function Slider({label,get,min,max,step,fmt,onv}){const[,redraw]=useReducer(x=>x+1,0);const id='s-'+label.replace(/\W/g,'');const v=get();
  return <div className="slider"><label htmlFor={id}>{label}</label><input type="range" id={id} min={min} max={max} step={step} value={v} onChange={e=>{onv(+e.target.value);redraw();}}/><output>{fmt(v)}</output></div>;}

function Choice({opts,on,pick}){return <div className="chips">{opts.map(([v,l])=><button key={String(v)} className="chip" aria-pressed={String(on(v))} onClick={()=>pick(v)}>{l}</button>)}</div>;}

export function Settings(){const S=state.settings;const backup=useRef(null),restore=useRef(null);
  const set=(fn,replan)=>{fn();if(replan)state.plan=null;save();render();};
  return <>
    <h2 className="sec">Settings</h2>
    <div className="set">
      <div className="field"><span className="lab">Warm-up length</span><Choice opts={[10,15,20,30].map(n=>[n,`${n} minutes`])} on={n=>S.len===n} pick={n=>set(()=>{S.len=n;},true)}/></div>
      <div className="field"><span className="lab">Focus</span><p className="help">How much weight each area gets when the planner builds your day. Zero leaves it out completely.</p>
        {DOMS.map(d=><Slider key={d} label={DNAME[d]} get={()=>state.settings.w[d]} min={0} max={3} step={.5} fmt={v=>v.toFixed(1)} onv={v=>{state.settings.w[d]=v;state.plan=null;save();}}/>)}</div>
      <div className="field"><span className="lab">New items per area, per session</span><p className="help">Once an area has a few items going, this caps how fast new material arrives so reviews stay on top.</p><Choice opts={[0,1,2,3].map(n=>[n,String(n)])} on={n=>S.newPer===n} pick={n=>set(()=>{S.newPer=n;},true)}/></div>
      <div className="field"><span className="lab">One-minute opener</span><p className="help">Start every session with 60 seconds of circle-of-5ths recall. It comes out of your session time.</p><Choice opts={[[true,'On'],[false,'Off']]} on={v=>(S.opener!==false)===v} pick={v=>set(()=>{S.opener=v;},true)}/></div>
      <div className="field"><span className="lab">Chord names over numerals</span><p className="help">Hidden makes you work out each chord from its Roman numeral in the key. Tap any numeral to check it.</p><Choice opts={[[false,'Hidden'],[true,'Shown']]} on={v=>!!S.showNames===v} pick={v=>set(()=>{S.showNames=v;})}/></div>
      <div className="field"><span className="lab">Rhythm reading feel</span><Choice opts={[[true,'Swung upbeats'],[false,'Straight upbeats']]} on={v=>S.swing===v} pick={v=>set(()=>{S.swing=v;})}/></div>
      <div className="field"><span className="lab">Sound</span><Slider label="Click volume" get={()=>state.settings.metVol} min={.1} max={1} step={.05} fmt={v=>Math.round(v*100)+'%'} onv={v=>{state.settings.metVol=v;save();}}/>
        <Slider label="Tap offset" get={()=>state.settings.tapOffset} min={-80} max={80} step={5} fmt={v=>`${v} ms`} onv={v=>{state.settings.tapOffset=v;save();}}/><p className="help">If reading results say you’re always rushing or dragging by the same amount, your device has audio delay. Set the offset to that figure (rushing is negative).</p></div>
      <div className="field"><span className="lab">Back up your progress</span><p className="help">Progress is saved in this browser only. Copy this text somewhere safe, or paste it into another device below.</p><textarea id="backup" readOnly ref={backup} value={JSON.stringify(state)}/>
        <div className="row"><button className="btn" onClick={()=>{const el=backup.current,t=el.value;(navigator.clipboard?.writeText(t)||Promise.reject()).then(()=>toast('Backup copied')).catch(()=>{el.focus();el.select();toast('Selected. Copy it manually');});}}>Copy backup</button></div></div>
      <div className="field"><span className="lab">Restore</span><textarea id="restore" ref={restore} placeholder="Paste a backup here"/><div className="row"><button className="btn" onClick={()=>{try{const s=JSON.parse(restore.current.value);if(!s||!s.items||!s.settings)throw 0;setState(merge(s));save();toast('Progress restored');render();}catch(e){toast('That doesn’t look like a Guide Tone backup');}}}>Restore from backup</button></div></div>
      <div className="field"><span className="lab">Start over</span>{UI.confirmReset?<div className="confirm"><span>Erase all ratings, tempos and history? This can’t be undone.</span><div className="row"><button className="btn danger" onClick={()=>{setState(defaults());save();UI.confirmReset=false;toast('Progress erased');render();}}>Erase everything</button><button className="btn" onClick={()=>{UI.confirmReset=false;render();}}>Cancel</button></div></div>
        :<div className="row"><button className="btn danger" onClick={()=>{UI.confirmReset=true;render();}}>Reset progress…</button></div>}</div>
    </div>
  </>;}
