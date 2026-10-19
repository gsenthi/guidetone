import {SCALE,FING_MAJ,keyName,scaleNotes} from '../../theory/index.js';
import {ITEMS,START_BPM} from '../../engine/catalogue.js';
import {hearLine} from '../../audio/synth.js';
import {CardShell,Fold,Keyboard,MetWidget,LadderLine,RateRow,itemBpm} from '../common.jsx';

/* Scales & speed: two octaves on a tempo ladder. */
export function ScaleCard({it,b,s}){const I=ITEMS[it.id];const notes=scaleNotes(I.sub,I.key);const S=SCALE[I.sub];
  return <CardShell it={it} b={b} s={s} title={`${keyName(I.key,S.set)} ${S.name}`} mid>
    <p className="instr">Two octaves up and down in quavers (two notes per click). Hands separately, then together. Keep the tone even, with no bumps at the thumb crossings.</p>
    <div className="notes">{notes.map((n,i)=><span key={i}>{n.name}</span>)}</div>
    {I.sub==='major'?<div className="notes"><span className="fing">{`RH fingering, one octave: ${FING_MAJ[I.key]}`}</span></div>:null}
    <Fold k="kbOpen" label="Show on the keyboard"><Keyboard notes={notes} cls="solo"/></Fold>
    <div className="row"><button className="btn" onClick={()=>{const m=notes.map(n=>n.midi);hearLine(m.concat(m.slice(0,-1).reverse()),120,false);}}>Hear it</button></div>
    <MetWidget bpm={itemBpm(it.id,START_BPM.scales)} mode="q8" showGuide/><LadderLine id={it.id} def={START_BPM.scales}/><RateRow it={it} bpm/>
  </CardShell>;}
