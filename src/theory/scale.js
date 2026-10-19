import {spell,asciiName,keyName,hasDouble,nearest} from './notes.js';
import {IIVI,chordsInKey} from './chords.js';

export const SCALE={
  major:{name:'Major',set:'maj',deg:[[1,0],[2,2],[3,4],[4,5],[5,7],[6,9],[7,11]]},
  dorian:{name:'Dorian',set:'min',deg:[[1,0],[2,2],[3,3],[4,5],[5,7],[6,9],[7,10]]},
  mixolydian:{name:'Mixolydian',set:'maj',deg:[[1,0],[2,2],[3,4],[4,5],[5,7],[6,9],[7,10]]},
  majpent:{name:'Major pentatonic',set:'maj',deg:[[1,0],[2,2],[3,4],[5,7],[6,9]]},
  minpent:{name:'Minor pentatonic',set:'min',deg:[[1,0],[3,3],[4,5],[5,7],[7,10]]},
  blues:{name:'Blues scale',set:'min',deg:[[1,0],[3,3],[4,5],[5,6],[5,7],[7,10]]},
  bebopdom:{name:'Bebop dominant',set:'maj',deg:[[1,0],[2,2],[3,4],[4,5],[5,7],[6,9],[7,10],[7,11]]},
  melmin:{name:'Melodic minor',set:'min',deg:[[1,0],[2,2],[3,3],[4,5],[5,7],[6,9],[7,11]]},
  bebopmaj:{name:'Bebop major',set:'maj',deg:[[1,0],[2,2],[3,4],[4,5],[5,7],[5,8],[6,9],[7,11]]},
  altered:{name:'Altered',set:'maj',deg:[[1,0],[2,1],[2,3],[3,4],[5,6],[6,8],[7,10]]},
  lyddom:{name:'Lydian dominant',set:'maj',deg:[[1,0],[2,2],[3,4],[4,6],[5,7],[6,9],[7,10]]},
  dimhw:{name:'Diminished (half-whole)',set:'maj',deg:[[1,0],[2,1],[2,3],[3,4],[4,6],[5,7],[6,9],[7,10]]},
  harmmin:{name:'Harmonic minor',set:'min',deg:[[1,0],[2,2],[3,3],[4,5],[5,7],[6,8],[7,11]]},
};
export const FING_MAJ={0:'1 2 3 1 2 3 4 5',7:'1 2 3 1 2 3 4 5',2:'1 2 3 1 2 3 4 5',9:'1 2 3 1 2 3 4 5',4:'1 2 3 1 2 3 4 5',11:'1 2 3 1 2 3 4 5',5:'1 2 3 4 1 2 3 4',10:'4 1 2 3 1 2 3 4',3:'3 1 2 3 4 1 2 3',8:'3 4 1 2 3 1 2 3',1:'2 3 1 2 3 4 1 2',6:'2 3 4 1 2 3 1 2'};
export const CHORD_SCALE={m7:'dorian',dom7:'mixolydian',maj7:'major'};
export const PAT={
  p1235:{name:'1-2-3-5',seq:[1,2,3,5]},
  p1357:{name:'1-3-5-7 arpeggio',seq:[1,3,5,7]},
  p5321:{name:'5-3-2-1',seq:[5,3,2,1]},
  penc:{name:'Enclosure to the 3rd',seq:[4,'c3',3]},
  p3579:{name:'3-5-7-9 arpeggio',seq:[3,5,7,9]},
};

export function scaleNotes(s,pc){const S=SCALE[s],root=asciiName(pc,S.set),list=S.deg.concat([[8,0]]);let prev=null;return list.map(([d,se],i)=>{const n=spell(root,d===8?1:d,se);let name=n.name;if(hasDouble(name))name=keyName(n.pc,S.set);const m=i===0?nearest(n.pc,60):prev+1+(((n.pc-(prev+1))%12)+12)%12;prev=m;return{name,pc:n.pc,midi:m};});}
export function patternGroups(p,pc){const ch=chordsInKey(IIVI,pc,'maj');let prev=null;return ch.map((c,ci)=>{const S=SCALE[CHORD_SCALE[c.q]].deg;const look=d=>{const base=((d-1)%7)+1;return S.find(x=>x[0]===base)[1];};
  const notes=PAT[p].seq.map((d,i)=>{const n=d==='c3'?spell(c.root,2,look(3)-1):spell(c.root,d,look(d));let m=prev==null?nearest(n.pc,64):nearest(n.pc,prev);if(i===0){while(m<57)m+=12;while(m>76)m-=12;}prev=m;return{name:n.name,pc:n.pc,midi:m};});return{sym:c.sym,rn:c.rn,notes};});}
