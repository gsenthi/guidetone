import {TECH,keyName,barsInKey,voiceTexture} from '../../theory/index.js';
import {state} from '../../engine/store.js';
import {ITEMS,START_BPM,buildMix} from '../../engine/catalogue.js';
import {pickMixTechs} from '../../engine/mix.js';
import {hearSeq} from '../../audio/synth.js';
import {UI,render} from '../../ui.js';
import {CardShell,BarsView,NamesChip,VoicingFold,MetWidget,LadderLine,RateRow,itemBpm} from '../common.jsx';

/* Reharmonisation: a plain progression and a technique. The answer is hidden unless the technique is new to you. */
export function ReharmCard({it,b,s}){const I=ITEMS[it.id],C=UI.card;const X=TECH[I.sub];const st=state.items[it.id];
  if(C.reveal==null)C.reveal=!Object.keys(state.items).some(id=>id.startsWith(`rx:${I.sub}:`));C.tex=C.tex||['shells','rootless','drop2','drop3'][(st?.n||0)%4];
  const base=barsInKey(X.base,I.key,X.mode),spice=barsInKey(X.spice,I.key,X.mode);const sf=spice.flat(),bf=base.flat();const sv=voiceTexture(sf,C.tex),bv=voiceTexture(bf,C.tex);
  return <CardShell it={it} b={b} s={s} title={X.name} mid>
    <div className="keysub" style={{marginTop:-8}}>{`${X.fam} · in ${keyName(I.key,X.mode)}${X.mode==='min'?' minor':' major'}`}</div>
    <p className="instr">{X.how}</p>
    <div className="row"><NamesChip/><span className="hint">Tap a numeral to check its chord name.</span></div>
    <div className="cc"><div className="eyebrow">Start from</div><BarsView bars={base} id="o"/></div>
    <div className="cc"><div className="eyebrow">Spiced up</div><BarsView bars={spice} id="s" hide={!C.reveal}/></div>
    {!C.reveal?<>
      <p className="instr">Play the starting progression once, in time. Then apply the technique and play your version, naming each new chord out loud. Reveal to check.</p>
      <div className="row"><button className="btn primary" onClick={()=>{C.reveal=true;render();}}>Reveal the reharm</button><button className="btn" onClick={()=>hearSeq(bf,bv)}>Hear the original</button></div></>:<>
      <VoicingFold sf={sf} sv={sv}/>
      <div className="row"><button className="btn" onClick={()=>hearSeq(bf,bv)}>Hear the original</button><button className="btn" onClick={()=>hearSeq(sf,sv)}>Hear it spiced</button></div></>}
    <MetWidget bpm={itemBpm(it.id,START_BPM.progressions)} mode="24"/><LadderLine id={it.id} def={START_BPM.progressions}/><RateRow it={it} ladder/>
  </CardShell>;}

/* Mixed reharm: three solid techniques chained into one longer progression. */
export function MixCard({it,b,s}){const I=ITEMS[it.id],C=UI.card;if(!C.mix){C.mix=pickMixTechs();C.reveal=false;}C.tex=C.tex||'shells';const M=buildMix(C.mix);
  const base=barsInKey(M.base,I.key,'maj'),spice=barsInKey(M.spice,I.key,'maj');const sf=spice.flat(),bf=base.flat();const sv=voiceTexture(sf,C.tex),bv=voiceTexture(bf,C.tex);
  return <CardShell it={it} b={b} s={s} title="Mixed reharm" mid>
    <div className="keysub" style={{marginTop:-8}}>{`${M.base.length} bars · in ${keyName(I.key,'maj')} major`}</div>
    <p className="instr">A longer progression built from techniques you already have solid. Play it plain once, then go round again spicing each section, without stopping. Naming the chords as you go is the real test.</p>
    <div className="segs">{M.segs.map((sg,i)=><div key={i} className="seg"><span className="segbars">{`Bars ${sg.from}–${sg.to}`}</span><b>{C.blind?'Your choice':TECH[sg.t].name}</b></div>)}</div>
    <div className="row"><NamesChip/><button className="chip" aria-pressed={String(!!C.blind)} onClick={()=>{C.blind=!C.blind;render();}}>Hide the techniques</button><button className="chip" onClick={()=>{C.mix=null;C.nm=null;render();}}>New mix</button></div>
    <div className="cc"><div className="eyebrow">Start from</div><BarsView bars={base} id="o"/></div>
    <div className="cc"><div className="eyebrow">{C.blind&&C.reveal?'One way to spice it':'Spiced up'}</div><BarsView bars={spice} id="s" hide={!C.reveal}/></div>
    {!C.reveal?<div className="row"><button className="btn primary" onClick={()=>{C.reveal=true;render();}}>Reveal the reharm</button><button className="btn" onClick={()=>hearSeq(bf,bv)}>Hear the original</button></div>:<>
      <VoicingFold sf={sf} sv={sv}/>
      <div className="row"><button className="btn" onClick={()=>hearSeq(bf,bv)}>Hear the original</button><button className="btn" onClick={()=>hearSeq(sf,sv)}>Hear it spiced</button></div></>}
    <MetWidget bpm={itemBpm(it.id,72)} mode="24"/><LadderLine id={it.id} def={72}/><RateRow it={it} ladder/>
  </CardShell>;}
