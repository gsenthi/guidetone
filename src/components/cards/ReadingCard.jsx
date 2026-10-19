import {READ,READ_BPM} from '../../theory/index.js';
import {state} from '../../engine/store.js';
import {ITEMS} from '../../engine/catalogue.js';
import {evalTaps} from '../../engine/reading.js';
import {audio,ctx,click,stopPlayback} from '../../audio/synth.js';
import {metStop} from '../../audio/metronome.js';
import {UI,render} from '../../ui.js';
import {CardShell,RateRow,itemBpm} from '../common.jsx';

const COUNTS=['1','&','2','&','3','&','4','&'];

/* Schedules the count-in and the pattern (twice, or once with clave clicks to listen), then scores the taps. */
function runReading(it,listen){const c=audio();if(!c)return;metStop();stopPlayback();const I=ITEMS[it.id],R=READ[I.sub],R2=UI.read;const beat=60/R2.bpm,sw=state.settings.swing;
  const t0=c.currentTime+.15;for(let i=0;i<4;i++)click(t0+i*beat,i===0?'accent':'beat');const start=t0+4*beat,reps=listen?1:2,bars=reps*2;
  for(let i=0;i<bars*4;i++)click(start+i*beat,i%4===0?'accent':'beat');const exp=[];
  for(let r=0;r<reps;r++)for(let j=0;j<16;j++)if(R.p[j]==='x'){const sb=Math.floor(j/2)+(j%2?(sw?2/3:.5):0);const t=start+(r*8+sb)*beat;exp.push(t);if(listen)click(t,'clave');}
  const end=start+bars*4*beat;Object.assign(R2,{phase:listen?'listen':'run',taps:[],exp,start,beat,end,result:listen?R2.result:null});render();
  setTimeout(()=>{if(UI.read!==R2)return;if(!listen){R2.result=evalTaps(R2.exp,R2.taps,R2.bpm,R2.start,R2.beat,bars);}R2.phase='idle';render();},(end-c.currentTime+.35)*1000);}

/* Your taps (dots) against the written notes (grey lines). */
function ResultView({r}){const W=600,H=64,total=r.bars*4*r.beat,X=t=>((t-r.start)/total)*W;const els=[];
  for(let i=0;i<=r.bars*4;i++){const x=(i/(r.bars*4))*W;els.push(<line key={'g'+i} x1={x} x2={x} y1={i%4===0?4:14} y2={H-4} stroke="var(--line)" strokeWidth={i%4===0?1.5:1}/>);}
  r.marks.forEach((m,i)=>{const x=X(m.t);els.push(<rect key={'n'+i} x={x-1.5} y="12" width="3" height="16" rx="1" fill="var(--muted)"/>);if(m.tap!=null){const ae=Math.abs(m.err);const col=ae<=.03?'var(--good)':ae<=.06?'var(--warn)':'var(--bad)';els.push(<circle key={'t'+i} cx={X(m.tap)} cy="44" r="6" fill={col}/>);}else els.push(<text key={'t'+i} x={x} y="49" textAnchor="middle" fontSize="13" fill="var(--bad)" fontFamily="var(--f-mono)">×</text>);});
  r.extra.forEach((t,i)=>{els.push(<circle key={'e'+i} cx={Math.max(4,Math.min(W-4,X(t)))} cy="44" r="5" fill="none" stroke="var(--bad)" strokeWidth="2"/>);});
  const pct=Math.round(r.rate*100),ms=r.meanAbs!=null?Math.round(r.meanAbs*1000):null,bias=Math.round(r.bias*1000);
  const feel=Math.abs(bias)<12?'Your time sits right on the grid.':bias<0?`You’re rushing by about ${-bias} ms.`:`You’re dragging by about ${bias} ms.`;
  return <div className="result"><div className="eyebrow">Your attempt</div><div><svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Timing of your taps against the written rhythm">{els}</svg></div>
    <div className="rstats"><span>{`${pct}% of notes hit`}</span><span>{ms!=null?`average ${ms} ms off`:'no notes hit'}</span><span>{`${r.extra.length} extra tap${r.extra.length===1?'':'s'}`}</span></div>
    <p className="hint">{`${ms!=null?feel+' ':''}Grey lines are the written notes; dots are your taps (green within 30 ms, amber within 60 ms). Suggested score: ${r.suggest}/10, highlighted below.`}</p></div>;}

/* Rhythm reading: two bars on a counting grid, tapped along on the pad or the space bar. */
export function ReadingCard({it,b,s}){const I=ITEMS[it.id],R=READ[I.sub],R2=UI.read;const bpm=itemBpm(it.id,READ_BPM[R.lvl]);R2.bpm=R2.bpm||bpm;
  const tap=e=>{const pad=e?.currentTarget||document.getElementById('pad');if(UI.read.phase!=='run'||!ctx)return;const lat=(ctx.outputLatency||0)+(ctx.baseLatency||0);UI.read.taps.push(ctx.currentTime-lat-(state.settings.tapOffset||0)/1000);
    if(pad){pad.classList.add('flash');setTimeout(()=>pad.classList.remove('flash'),70);}};
  UI.read.tapFn=tap;
  const busy=R2.phase==='run'||R2.phase==='listen';
  return <CardShell it={it} b={b} s={s} title={R.name||`Reading ${I.sub+1}`} mid>
    <div className="keysub" style={{marginTop:-8}}>{`Level ${R.lvl} · two bars of 4/4`}</div>
    <p className="instr">{`Read the two bars, then tap along on the pad (or your space bar). One bar count-in, then the pattern twice. ${state.settings.swing?'Upbeats are swung.':'Upbeats are straight.'}`}</p>
    <div className="rgrid">{[0,1].map(bar=><div key={bar} className="rbar">{COUNTS.map((c,i)=>{const x=R.p[bar*8+i]==='x';return <div key={i} className={'rcell'+(i%2===0?' beat':'')}><span className="cnt">{c}</span>{x?<span className="hit"/>:<span className="rest"/>}</div>;})}</div>)}</div>
    <div className="row"><button className="btn" disabled={busy} onClick={()=>runReading(it,true)}>Listen first</button><button className="btn primary" disabled={busy} onClick={()=>runReading(it,false)}>{R2.result?'Try again':'Start'}</button>
      <div className="row" style={{gap:6}}><button className="btn sq" disabled={busy} aria-label="Slower" onClick={()=>{R2.bpm=Math.max(40,R2.bpm-4);render();}}>−</button><span className="clock" style={{fontSize:18}}>{`${R2.bpm} bpm`}</span><button className="btn sq" disabled={busy} aria-label="Faster" onClick={()=>{R2.bpm+=4;render();}}>+</button></div></div>
    <button className={'pad'+(R2.phase==='run'?' live':'')} id="pad" aria-label="Tap pad" onPointerDown={e=>{e.preventDefault();tap(e);}}>{R2.phase==='run'?'Tap':R2.phase==='listen'?'Listening…':'Tap pad'}</button>
    {R2.result?<ResultView r={R2.result}/>:null}
    <RateRow it={it} suggest={R2.result?.suggest} bpmVal={R2.bpm}/>
  </CardShell>;}
