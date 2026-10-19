import {nearest} from '../theory/index.js';
import {state} from '../engine/store.js';

/* A simple Web Audio synth: triangle + octave sine through a closing low-pass, and short oscillator clicks. */
export let ctx=null,master=null,active=[];
export function audio(){if(!ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ctx=new AC();const comp=ctx.createDynamicsCompressor();master=ctx.createGain();master.gain.value=.8;master.connect(comp);comp.connect(ctx.destination);}if(ctx.state==='suspended')ctx.resume();return ctx;}
export const mtof=m=>440*Math.pow(2,(m-69)/12);
export function pianoNote(m,t,dur=1.4,vel=.5){const c=ctx;const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vel*.22,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  const f=c.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(3000,t);f.frequency.exponentialRampToValueAtTime(700,t+dur);
  const o1=c.createOscillator();o1.type='triangle';o1.frequency.value=mtof(m);const o2=c.createOscillator();o2.type='sine';o2.frequency.value=mtof(m)*2;const g2=c.createGain();g2.gain.value=.3;
  o1.connect(f);o2.connect(g2);g2.connect(f);f.connect(g);g.connect(master);o1.start(t);o2.start(t);o1.stop(t+dur+.05);o2.stop(t+dur+.05);
  active=active.filter(a=>a.end>c.currentTime);active.push({g,o:[o1,o2],end:t+dur});}
export function stopPlayback(){if(!ctx)return;const t=ctx.currentTime;active.forEach(a=>{try{a.g.gain.cancelScheduledValues(t);a.g.gain.setValueAtTime(.0001,t+.02);a.o.forEach(o=>o.stop(t+.04));}catch(e){}});active=[];}
export const CLICK={accent:[1650,.55,.05,'sine'],beat:[1150,.42,.05,'sine'],tick:[2700,.13,.025,'sine'],poly:[640,.5,.07,'triangle'],clave:[2300,.5,.045,'square']};
export function click(t,kind){const c=ctx,[fr,amp,len,type]=CLICK[kind];const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=fr;const a=amp*(state.settings.metVol??.8)*(type==='square'?.35:1);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,a),t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.connect(g);g.connect(master);o.start(t);o.stop(t+len+.02);}
export function hearChord(notes){const c=audio();if(!c)return;stopPlayback();const t=c.currentTime+.05;notes.forEach((n,i)=>pianoNote(n.midi,t+i*.14,1.1,.5));const t2=t+notes.length*.14+.2;notes.forEach(n=>pianoNote(n.midi,t2,2.2,.5));}
export function hearSeq(chords,voiced,bpm=96){const c=audio();if(!c)return;stopPlayback();const beat=60/bpm;let t=c.currentTime+.08;chords.forEach((ch,i)=>{const v=voiced[i],d=ch.beats*beat;if(!v.lh)pianoNote(nearest(ch.pc,40),t,d*.95,.6);v.forEach(n=>pianoNote(n.midi,t+.01,d*.92,.45));t+=d;});}
export function hearLine(midis,bpm,swing){const c=audio();if(!c)return;stopPlayback();const beat=60/bpm;const t=c.currentTime+.08;midis.forEach((m,i)=>{const pos=Math.floor(i/2)*beat+(i%2?(swing?beat*2/3:beat/2):0);pianoNote(m,t+pos,beat*.9,.5);});}
