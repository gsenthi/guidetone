import {QUAL,asciiName,spell,degLabel,hasDouble,pretty,MAJ_NAMES,twoHand} from '../../theory/index.js';
import {ITEMS} from '../../engine/catalogue.js';
import {hearChord} from '../../audio/synth.js';
import {UI,render} from '../../ui.js';
import {CardShell,Fold,Keyboard,RateRow,notesText} from '../common.jsx';

/* Chords & extensions: spell the quality, then root + guide tone in the LH and the colour tones in the RH. */
export function ChordCard({it,b,s}){const I=ITEMS[it.id],C=UI.card;const Q=QUAL[I.sub],root=asciiName(I.key,Q.mode);
  const tones=Q.tones.map(t=>{const n=spell(root,t[0],t[1]);return{lab:degLabel(t),name:hasDouble(n.name)?pretty(MAJ_NAMES[n.pc]):n.name};});const th=twoHand(I.sub,I.key);
  return <CardShell it={it} b={b} s={s} title={I.label}>
    <div className="keysub" style={{marginTop:-8}}>{Q.name}</div>
    <p className="instr">Spell it out loud from the root up, extensions included. Then play it: root and guide tone in the left hand, the colour tones in the right. Check, then play it again without looking.</p>
    {!C.reveal?<div className="row"><button className="btn" onClick={()=>{C.reveal=true;render();}}>Show the notes</button></div>:<>
      <div className="tones">{tones.map((t,i)=><span key={i} className="tone"><b>{t.lab}</b>{t.name}</span>)}</div>
      <p className="hint">{Q.note}</p>
      <Fold k="kbOpen" label={`Voicing · LH ${notesText(th.lh)} · RH ${notesText(th.rh)}`}><div className="hands"><div className="cc"><div className="eyebrow">Left hand</div><Keyboard notes={th.lh}/></div><div className="cc"><div className="eyebrow">Right hand</div><Keyboard notes={th.rh}/></div></div></Fold>
      <div className="row"><button className="btn" onClick={()=>hearChord([...th.lh,...th.rh])}>Hear it</button></div></>}
    <RateRow it={it}/>
  </CardShell>;}
