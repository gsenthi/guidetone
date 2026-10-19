import {avg} from './dates.js';

/* Scores rhythm-reading taps against the written notes and suggests a 1–10 score. */
export function evalTaps(exp,taps,bpm,start,beat,bars){const win=Math.min(.16,beat*.33);const used=new Set();const marks=exp.map(t=>{let bi=-1,bd=1e9;taps.forEach((x,i)=>{if(used.has(i))return;const d=Math.abs(x-t);if(d<bd){bd=d;bi=i;}});if(bi>=0&&bd<=win){used.add(bi);return{t,tap:taps[bi],err:taps[bi]-t};}return{t,tap:null};});
  const hits=marks.filter(m=>m.tap!=null),errs=hits.map(m=>m.err);const extra=taps.filter((x,i)=>!used.has(i)&&x>start-beat*.5);
  const rate=hits.length/exp.length,meanAbs=errs.length?avg(errs.map(Math.abs)):null,bias=errs.length?avg(errs):0;
  const suggest=Math.max(1,Math.min(10,Math.round(10*rate-extra.length*.7-(meanAbs==null?0:Math.max(0,meanAbs*1000-20)/10))));
  return{marks,extra,rate,meanAbs,bias,suggest,start,beat,bars,bpm};}
