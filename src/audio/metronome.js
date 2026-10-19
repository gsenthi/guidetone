import {audio,ctx,click,stopPlayback} from './synth.js';

/* Look-ahead metronome: schedules a bar of clicks at a time, 250 ms ahead, on a 25 ms timer. */
export const Met={on:false,bpm:100,mode:'all',guide:true,timer:null,next:0,bar:0,marks:[]};
export function barEvents(mode,bar,guide){const E=[],beats=()=>{for(let i=0;i<4;i++)E.push({b:i,k:i===0?'accent':'beat'});};
  switch(mode){
    case 'all':beats();break;
    case 'q8':beats();if(guide)for(let i=0;i<4;i++)E.push({b:i+.5,k:'tick'});break;
    case 'sw8':beats();if(guide)for(let i=0;i<4;i++)E.push({b:i+2/3,k:'tick'});break;
    case '24':E.push({b:1,k:'beat'},{b:3,k:'beat'});break;
    case 'b4':E.push({b:3,k:'beat'});break;
    case 'bar2':if(bar%2===0)E.push({b:0,k:'accent'});break;
    case 'and4':E.push({b:3+2/3,k:'beat'});break;
    case 'gap':if(bar%2===0)beats();break;
    case 'sd83':beats();if(guide){const tr=bar%2===1;for(let i=0;i<4;i++){if(tr)E.push({b:i+1/3,k:'tick'},{b:i+2/3,k:'tick'});else E.push({b:i+.5,k:'tick'});}}break;
    case 'sdLadder':{beats();if(guide){const n=[1,2,3,4,3,2][bar%6];for(let i=0;i<4;i++)for(let j=1;j<n;j++)E.push({b:i+j/n,k:'tick'});}break;}
    case 'sdSwing':{beats();if(guide){const sw=Math.floor(bar/2)%2===1;for(let i=0;i<4;i++)E.push({b:i+(sw?2/3:.5),k:'tick'});}break;}
    case 'sd32':beats();if(guide)for(let i=0;i<6;i++)E.push({b:i*2/3,k:'poly'});break;
    case 'sd34':beats();if(guide)for(let i=0;i<3;i++)E.push({b:i*4/3,k:'poly'});break;
  }return E;}
export const MODE_TEXT={all:'Click on every beat',q8:'Beats, with quaver guide clicks',sw8:'Beats, with swung upbeat clicks','24':'Click on 2 and 4',b4:'Click on beat 4 only',bar2:'Click on beat 1 of every other bar',and4:'Click on the swung “and” of 4',gap:'One bar on, one bar off',sd83:'Alternating quaver and triplet bars',sdLadder:'Crotchets → quavers → triplets → semiquavers',sdSwing:'Two bars straight, two bars swung',sd32:'Beats + three-against-two',sd34:'Beats + three-against-four'};
export function metTick(){const c=ctx;while(Met.next<c.currentTime+.25){const spb=60/Met.bpm;barEvents(Met.mode,Met.bar,Met.guide).forEach(e=>click(Met.next+e.b*spb,e.k));Met.marks.push({t:Met.next,spb});if(Met.marks.length>8)Met.marks.shift();Met.next+=4*spb;Met.bar++;}}
export function metStart(){const c=audio();if(!c)return;stopPlayback();Met.on=true;Met.bar=0;Met.marks=[];Met.next=c.currentTime+.12;clearInterval(Met.timer);Met.timer=setInterval(metTick,25);metTick();}
export function metStop(){Met.on=false;clearInterval(Met.timer);Met.timer=null;}
/* Which beat of the bar is sounding now, for the beat lights (-1 when stopped). */
export function currentBeat(){if(!Met.on||!ctx)return -1;const now=ctx.currentTime;let mk=null;for(const m of Met.marks)if(m.t<=now)mk=m;if(!mk)return -1;return Math.floor((now-mk.t)/mk.spb)%4;}
