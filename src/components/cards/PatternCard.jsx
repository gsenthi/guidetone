import {PAT,keyName,patternGroups} from '../../theory/index.js';
import {ITEMS,START_BPM} from '../../engine/catalogue.js';
import {hearLine} from '../../audio/synth.js';
import {Met} from '../../audio/metronome.js';
import {CardShell,Fold,NameTag,MetWidget,LadderLine,RateRow,itemBpm,notesText} from '../common.jsx';

/* Patterns & lines: a digital pattern or enclosure over each chord of a ii–V–I. */
export function PatternCard({it,b,s}){const I=ITEMS[it.id];const g=patternGroups(I.sub,I.key);
  return <CardShell it={it} b={b} s={s} title={PAT[I.sub].name} mid>
    <div className="keysub" style={{marginTop:-8}}>{`Over a ii–V–I in ${keyName(I.key,'maj')}`}</div>
    <p className="instr">Right hand plays the pattern on each chord in swung quavers, two beats per chord. Add left-hand shells once it’s steady. Then try starting each group an octave higher.</p>
    <div className="row" style={{gap:18}}>{g.map((x,i)=><div key={i} className="row" style={{gap:8,alignItems:'baseline'}}><span className="sym">{x.rn}</span><NameTag id={'p'+i} sym={x.sym}/></div>)}</div>
    <Fold k="notesOpen" label="Show the notes"><div className="kbgrid">{g.map((x,i)=><div key={i} className="cc"><div className="row" style={{gap:10,alignItems:'baseline'}}><span className="sym">{x.sym}</span><span className="rn">{x.rn}</span></div><div className="nn">{notesText(x.notes)}</div></div>)}</div></Fold>
    <div className="row"><button className="btn" onClick={()=>hearLine(g.flatMap(x=>x.notes.map(n=>n.midi)),Math.min(Met.bpm,160),true)}>Hear it</button></div>
    <MetWidget bpm={itemBpm(it.id,START_BPM.patterns)} mode="sw8" showGuide/><LadderLine id={it.id} def={START_BPM.patterns}/><RateRow it={it} bpm/>
  </CardShell>;}
