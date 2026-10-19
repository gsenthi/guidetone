import {CYCLE4,keyName} from '../theory/index.js';
import {state} from '../engine/store.js';
import {ITEMS,CURR,DOMS,DNAME,PFXS,LIB_SUBS,MIX_NEED,subMode} from '../engine/catalogue.js';
import {learntTechs,mixUnlocked} from '../engine/mix.js';
import {mastery,mBand} from '../engine/scores.js';
import {UI,render} from '../ui.js';
import {startAdhoc} from '../session.js';
import {CircleWidget,ExplorerPanel} from '../components/common.jsx';

const Dot=({m})=><span className={'dot '+mBand(m)}/>;

function Rhythm(){
  return <table className="rh"><thead><tr><th>Exercise</th><th>Type</th><th></th></tr></thead><tbody>{CURR.rhythm.map(id=>{const I=ITEMS[id],m=mastery(state.items[id]);
    return <tr key={id}><td><Dot m={m}/>{' '}{I.label}</td><td className="muted">{I.type==='read'?'Reading':I.type==='feel'?'Time feel':'Subdivision'}</td><td style={{textAlign:'right'}}><button className="btn" onClick={()=>startAdhoc([id],I.label)}>Practise</button></td></tr>;})}</tbody></table>;}

/* Drill anything directly, outside the daily plan. */
export function Library(){const L=UI.lib;let sec;
  if(L.d==='rhythm')sec=<Rhythm/>;
  else{const cpc=L.cpc??0;const mode=subMode(L.d,L.sub);
    const id=`${PFXS[L.d]}:${L.sub}:${L.key}`;const i0=CYCLE4.indexOf(L.key);const all=[...CYCLE4.slice(i0),...CYCLE4.slice(0,i0)].map(pc=>`${PFXS[L.d]}:${L.sub}:${pc}`);
    const locked=L.d==='progressions'&&L.sub==='mix'&&!mixUnlocked();
    sec=<>
      {L.d==='circle'?<><div className="field"><span className="lab">Explore the circle</span><p className="help">Tap a key to see its signature, relative minor, chords and neighbours. Inner ring: relative minors.</p>
        <CircleWidget sel={cpc} onPick={pc=>{L.cpc=pc;render();}} center={<span className="qbig">{keyName(cpc,'maj')}</span>}/><ExplorerPanel pc={cpc}/></div>
        <div className="row"><button className="btn primary" onClick={()=>startAdhoc(['cy:quiz'],'Circle recall')}>Circle recall · 60 seconds</button></div></>:null}
      <div className="field"><span className="lab">Type</span><div className="chips">{LIB_SUBS[L.d].map(([k,n])=><button key={k} className="chip" aria-pressed={String(L.sub===k)} onClick={()=>{L.sub=k;render();}}>{n}</button>)}</div></div>
      <div className="field"><span className="lab">Key</span><div className="keys">{CYCLE4.map(pc=>{const m=mastery(state.items[`${PFXS[L.d]}:${L.sub}:${pc}`]);
        return <button key={pc} className="keybtn" aria-pressed={String(L.key===pc)} onClick={()=>{L.key=pc;render();}}>{keyName(pc,mode)}<Dot m={m}/></button>;})}</div></div>
      {locked?<div className="empty">{`Mixed reharm unlocks once ${MIX_NEED} techniques are solid: scored 7 or more at least twice in any key. You have ${learntTechs().length} of ${MIX_NEED} so far.`}</div>
        :<div className="row"><button className="btn primary" onClick={()=>startAdhoc([id],ITEMS[id].label)}>{`Practise ${ITEMS[id].label}`}</button><button className="btn" onClick={()=>startAdhoc(all,`${LIB_SUBS[L.d].find(x=>x[0]===L.sub)[1]} · all 12 keys`)}>All 12 keys from here</button></div>}
    </>;}
  return <>
    <h2 className="sec">Library</h2><p className="lede">Drill anything directly, outside the daily plan. Ratings here count towards your progress too. “All 12 keys” runs the same thing round the cycle of 4ths.</p>
    <div className="chips" role="group" aria-label="Area">{DOMS.map(d=><button key={d} className="chip" aria-pressed={String(L.d===d)} onClick={()=>{L.d=d;if(LIB_SUBS[d])L.sub=LIB_SUBS[d][0][0];render();}}>{DNAME[d]}</button>)}</div>
    <div className="libsec">{sec}</div>
  </>;}
