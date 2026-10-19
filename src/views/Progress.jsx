import {Fragment} from 'react';
import {CYCLE4,QZ_NAME,keyName} from '../theory/index.js';
import {state} from '../engine/store.js';
import {ITEMS,CURR,DNAME,PFXS,LIB_SUBS} from '../engine/catalogue.js';
import {sv,mastery,mBand,toScore} from '../engine/scores.js';
import {ymd,dayNum} from '../engine/dates.js';
import {startAdhoc} from '../session.js';
import {Stats} from '../components/common.jsx';

const Dot=({m})=><span className={'dot '+mBand(m)}/>;
function streak(){const days=new Set(state.log.map(l=>l.d));let n=0;const d=new Date();if(!days.has(ymd(d)))d.setDate(d.getDate()-1);while(days.has(ymd(d))){n++;d.setDate(d.getDate()-1);}return n;}

/* Streak, last four weeks, a mastery heat map per area across all 12 keys, recall stats and rhythm. */
export function Progress(){const today=dayNum();const week=state.log.filter(l=>today-dayNum(l.d)<7).reduce((a,l)=>a+l.min,0);const started=Object.keys(state.items).filter(id=>ITEMS[id]).length,total=Object.keys(ITEMS).length;
  const mins={};state.log.forEach(l=>mins[l.d]=(mins[l.d]||0)+l.min);const cal=[];for(let i=27;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const m=mins[ymd(d)]||0;cal.push(<i key={i} className={m===0?'':m<10?'l1':m<20?'l2':'l3'} title={`${d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})}: ${m} min`}/>);}
  const QS=state.quizStats||{};const rows=Object.keys(QZ_NAME).filter(k=>QS[k]);
  return <>
    <Stats rows={[[streak(),'day streak'],[week,'minutes this week'],[state.log.length,'sessions'],[`${started}/${total}`,'items started']]}/>
    <div className="field" style={{marginTop:16}}><span className="eyebrow">Last 4 weeks</span><div className="cal">{cal}</div></div>
    {!started?<div className="empty" style={{marginTop:22}}>Nothing rated yet. Each item you rate fills in a square below, coloured by how solid it is. Start today’s warm-up to see the map come alive.</div>:null}
    <div className="legend" style={{marginTop:22}}><span><i/>not started</span><span><i className="m0"/>1–3</span><span><i className="m1"/>4–6</span><span><i className="m2"/>7–8</span><span><i className="m3"/>9–10</span><span><i className="m3 due"/>due for review</span></div>
    {['circle','chords','progressions','scales','patterns'].map(d=><Fragment key={d}><h2 className="sec">{DNAME[d]}</h2>
      <div className="heat"><table><thead><tr><th/>{CYCLE4.map(pc=><th key={pc}>{keyName(pc,'maj')}</th>)}</tr></thead>
        <tbody>{LIB_SUBS[d].map(([k,n])=><tr key={k}><th>{n}</th>{CYCLE4.map(pc=>{const id=`${PFXS[d]}:${k}:${pc}`;const st=state.items[id];const m=mastery(st);
          return <td key={pc}><button className={`cell ${mBand(m)}${st&&st.due<=today?' due':''}`} title={`${ITEMS[id].label}${st?` · averaging ${toScore(m)}/10 · best ${st.best||'—'} bpm`:' · not started'}`} aria-label={ITEMS[id].label} onClick={()=>startAdhoc([id],ITEMS[id].label)}/></td>;})}</tr>)}</tbody></table></div></Fragment>)}
    <h2 className="sec">Circle recall</h2>
    {rows.length?<table className="rh"><thead><tr><th>Question type</th><th>Answered</th><th>Right</th><th>Average</th></tr></thead><tbody>{rows.map(k=>{const q=QS[k];const pct=q.ok/q.n;
      return <tr key={k}><td><Dot m={pct}/>{' '}{QZ_NAME[k]}</td><td className="num">{q.n}</td><td className="num">{`${Math.round(pct*100)}%`}</td><td className="num">{`${(q.ms/q.n/1000).toFixed(1)}s`}</td></tr>;})}</tbody></table>
      :<div className="empty">Your recall accuracy and speed by question type will appear here after your first opener.</div>}
    <h2 className="sec">{DNAME.rhythm}</h2>
    <table className="rh"><thead><tr><th>Exercise</th><th>Last</th><th>Best clean</th><th>Next</th></tr></thead><tbody>{CURR.rhythm.map(id=>{const st=state.items[id];const m=mastery(st);
      return <tr key={id}><td><Dot m={m}/>{' '}{ITEMS[id].label}</td><td className="num">{st?`${sv(st.hist[st.hist.length-1])}/10`:'—'}</td><td className="num">{st?.best?`${st.best} bpm`:'—'}</td><td className="num">{st?(st.due<=today?'due':`${st.due-today} d`):'—'}</td></tr>;})}</tbody></table>
  </>;}
