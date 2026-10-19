import {RH,keyName} from '../../theory/index.js';
import {ITEMS} from '../../engine/catalogue.js';
import {CardShell,MetWidget,LadderLine,RateRow,itemBpm} from '../common.jsx';

/* Rhythm & time: time-feel and subdivision drills against the metronome. */
export function FeelCard({it,b,s}){const I=ITEMS[it.id];const R=RH[I.sub];const key=keyName(s.key,'maj');
  return <CardShell it={it} b={b} s={s} title={R.name} mid>
    <p className="instr">{R.desc}</p>
    {I.type==='feel'?<p className="hint">{`Material: ${key} major scale or a ii–V–I in ${key}. Play for at least a minute before you rate it.`}</p>:null}
    <MetWidget bpm={itemBpm(it.id,R.bpm)} mode={R.mode} showGuide={I.type==='sub'}/><LadderLine id={it.id} def={R.bpm}/><RateRow it={it} bpm/>
  </CardShell>;}
