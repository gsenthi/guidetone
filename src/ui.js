import {metStop} from './audio/metronome.js';
import {stopPlayback} from './audio/synth.js';

/* Screen state that isn't saved: current view, the live card's scratch state, library selection.
   Handlers mutate it (and the saved state) then call render(), which re-renders the app. */
export const UI={view:'today',adhoc:null,card:{},cardId:null,read:{phase:'idle'},summary:null,lib:{d:'chords',sub:'maj7',key:0},confirmReset:false,toast:null};

const subs=new Set();let version=0;
export const subscribe=fn=>{subs.add(fn);return()=>subs.delete(fn);};
export const getVersion=()=>version;
export function render(){version++;subs.forEach(fn=>fn());}

export function go(v){if(v!=='session'){metStop();stopPlayback();}UI.view=v;render();window.scrollTo(0,0);}
export function toast(msg){UI.toast=msg;render();clearTimeout(toast.tm);toast.tm=setTimeout(()=>{UI.toast=null;render();},2200);}

let wake=null;
export async function wakeOn(){try{wake=await navigator.wakeLock?.request('screen');}catch(e){}}
export function wakeOff(){try{wake?.release();}catch(e){}wake=null;}
