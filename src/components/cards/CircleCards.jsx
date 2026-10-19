import {useEffect,useReducer} from 'react';
import {CYC,TEX,keyName,barsInKey,cycleChain,cyclePath,voiceTexture} from '../../theory/index.js';
import {ITEMS} from '../../engine/catalogue.js';
import {pad2} from '../../engine/dates.js';
import {quizNext,quizRecord,quizSummary} from '../../engine/quiz.js';
import {audio,hearSeq} from '../../audio/synth.js';
import {UI,render} from '../../ui.js';
import {CardShell,CircleWidget,PathView,BarsView,NamesChip,VoicingFold,MetWidget,LadderLine,RateRow,Stats,itemBpm,ckLabel} from '../common.jsx';

const secsLeft=Q=>Math.max(0,Math.ceil((Q.end-Date.now())/1000));
const mmss=l=>`${Math.floor(l/60)}:${pad2(l%60)}`;

function quizStart(Q){Object.assign(Q,{phase:'run',end:Date.now()+60000,log:[],cur:null,flash:null});quizNext(Q);render();}
function quizAnswer(Q,pc){if(Q.phase!=='run')return;const c=Q.cur;const ms=performance.now()-c.t0;const ok=quizRecord(c,pc,ms);Q.log.push({...c,pick:pc,ok,ms});
  Q.flash=ok?{[pc]:'ok'}:{[pc]:'bad',[c.a]:'ok'};Q.lastOk=ok;Q.lastText=ok?'':`${c.text}: ${ckLabel(c.a)}`;quizNext(Q);render();
  const f=Q.flash;setTimeout(()=>{if(Q.flash===f){Q.flash=null;render();}},450);}
function quizEnd(Q){Q.phase='done';Object.assign(Q,quizSummary(Q.log));render();}

/* Counts down the minute, and ends the quiz at zero. */
function QuizClock({Q}){const[,tick]=useReducer(x=>x+1,0);
  useEffect(()=>{const iv=setInterval(()=>{if(secsLeft(Q)<=0){clearInterval(iv);quizEnd(Q);}else tick();},200);return()=>clearInterval(iv);},[Q]);
  return <span className="clock" id="qclock">{mmss(secsLeft(Q))}</span>;}

/* The one-minute opener: circle-of-5ths recall, answered by tapping the circle. */
export function QuizCard({it,b,s}){const C=UI.card;const Q=C.quiz=C.quiz||{phase:'idle'};let body;
  if(Q.phase==='idle')body=<>
    <p className="instr">Sixty seconds of quick questions on the circle: fifths, fourths, relative minors, tritone subs, key signatures. Answer by tapping the key on the circle. Speed counts as much as accuracy, and keys you get wrong come up more often.</p>
    <CircleWidget disabled center={<span className="qbig">60s</span>}/>
    <div className="row"><button className="btn primary big" onClick={()=>{audio();quizStart(Q);}}>Start</button></div></>;
  else if(Q.phase==='run'){const n=Q.log.length,ok=Q.log.filter(x=>x.ok).length;body=<>
    <div className="row" style={{justifyContent:'space-between'}}><QuizClock Q={Q}/><span className="rstats">{`${ok} of ${n} right`}</span></div>
    <div className="qprompt">{Q.cur.text}</div>
    <CircleWidget mark={Q.flash} minors={false} onPick={pc=>quizAnswer(Q,pc)} center={Q.lastText?<span className="qmiss">{Q.lastText}</span>:<span className="qbig">{n?(Q.lastOk?'✓':''):'?'}</span>}/></>;}
  else{const S=Q.sum;const miss=Q.log.filter(x=>!x.ok);body=<>
    <Stats rows={[[`${S.ok}/${S.n}`,'right'],[`${(S.av/1000).toFixed(1)}s`,'average answer']]}/>
    {miss.length?<div className="cc"><div className="eyebrow">To look at again</div><ul className="items">{miss.map((x,i)=><li key={i}><b>{x.text}</b><span className="tag">{`answer ${ckLabel(x.a)} · you said ${ckLabel(x.pick)}`}</span></li>)}</ul></div>:<p className="instr">No mistakes. Faster next time.</p>}
    <div className="row"><button className="btn" onClick={()=>quizStart(Q)}>Go again</button></div>
    <RateRow it={it} suggest={Q.suggest}/></>;}
  return <CardShell it={it} b={b} s={s} title="Circle recall" mid>{body}</CardShell>;}

/* Circle drills: dominant chains, guide-tone lines, ii–V–Is and diatonic cycles, voice-led. */
export function CycleCard({it,b,s}){const I=ITEMS[it.id],X=CYC[I.sub],C=UI.card;if(!X.tex.includes(C.tex))C.tex=X.tex[0];const TL=TEX.filter(t=>X.tex.includes(t.k));
  let chords,path;
  if(X.bars){const bars=barsInKey(X.bars.map(c=>[c]),I.key,X.mode);chords=bars.flat();path=<>
    <div className="row"><NamesChip/><span className="hint">Tap a numeral to check its chord name.</span></div><BarsView bars={bars} id="d"/></>;}
  else{chords=cycleChain(I.sub,I.key);path=<>
    <div className="cc"><div className="eyebrow">{I.sub==='iiV'?'Keys in order':'Chords in order'}</div><PathView labels={cyclePath(I.sub,I.key)}/></div>
    <div className="row"><button className="chip" aria-pressed={String(!!C.pathAll)} onClick={()=>{C.pathAll=!C.pathAll;render();}}>Show the whole path</button><span className="hint">Tap a ? to check the next step.</span></div></>;}
  const sv=voiceTexture(chords,C.tex);
  return <CardShell it={it} b={b} s={s} title={X.name} mid>
    <div className="keysub" style={{marginTop:-8}}>{X.bars?`In ${keyName(I.key,X.mode)}${X.mode==='min'?' minor':' major'}`:`Starting from ${keyName(I.key,'maj')} · ${X.n} ${I.sub==='iiV'?'keys':'chords'} anticlockwise`}</div>
    <p className="instr">{X.how}</p>
    {path}
    <VoicingFold sf={chords} sv={sv} TL={TL}/><div className="row"><button className="btn" onClick={()=>hearSeq(chords,sv)}>Hear it</button></div>
    <MetWidget bpm={itemBpm(it.id,72)} mode="24"/><LadderLine id={it.id} def={72}/><RateRow it={it} ladder/>
  </CardShell>;}
