import {QUAL} from './qual.js';
import {spell,asciiName,pretty,hasDouble,MAJ_NAMES} from './notes.js';

/* A chord in a bar: Roman numeral, scale degree, semitones above the key, quality, and whether it is new in the reharm. */
export const IIVI=[['ii',2,2,'m7'],['V',5,7,'dom7'],['I',1,0,'maj7']];
export const K=(rn,d,s,q,nw)=>({rn,d,s,q,nw:!!nw});
/* Roots that would need a double accidental, F♭, C♭, E♯ or B♯ fall back to the simpler enharmonic. */
export function chordsInKey(list,pc,mode){const key=asciiName(pc,mode);return list.map(([rn,d,s,q])=>{let r=spell(key,d,s);if(hasDouble(r.name)||/^(F♭|C♭|E♯|B♯)$/.test(r.name))r={name:pretty(MAJ_NAMES[r.pc]),ascii:MAJ_NAMES[r.pc],pc:r.pc};return{rn,q,root:r.ascii,rootName:r.name,pc:r.pc,sym:r.name+QUAL[q].sym};});}
export function barsInKey(bars,pc,mode){return bars.map(bar=>{const cs=chordsInKey(bar.map(c=>[c.rn,c.d,c.s,c.q]),pc,mode);return cs.map((c,i)=>({...c,nw:bar[i].nw,beats:4/bar.length}));});}
