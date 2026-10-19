import {keyName,MAJ_NAMES,SIG} from './notes.js';
import {K,IIVI,chordsInKey} from './chords.js';

/* Circle-of-5ths drills and the recall-quiz question types. */
export const CYC={
  dom7:{name:'Dominant 7ths round the circle',mode:'maj',n:12,tex:['shells','rootless','drop2'],how:'Start on the dominant shown and move down a 5th each bar, anticlockwise round the circle, until you are back where you started. Say each chord name before you play it. If the next root comes slowly, that’s exactly what this drill fixes.'},
  guide:{name:'Guide tones down the circle',mode:'maj',n:12,tex:['guide'],how:'Left hand plays the root, right hand only the 3rd and 7th. Each chord’s 7th falls a semitone to become the next chord’s 3rd, and the 3rd holds to become the next 7th. Your right hand slides down one semitone per chord, an octave in all, while the harmony travels through all 12 keys.'},
  iiV:{name:'ii–V–I down the circle',mode:'maj',n:6,tex:['rootless','shells','drop2'],how:'Play a ii–V–I, then move to the key a 5th lower and play the next one without stopping. Six keys per run. Keep each voicing close to the last.'},
  diatmaj:{name:'Diatonic cycle (major)',mode:'maj',tex:['rootless','shells','drop2','drop3'],bars:[K('I',1,0,'maj7'),K('IV',4,5,'maj7'),K('viiø',7,11,'m7b5'),K('iii',3,4,'m7'),K('vi',6,9,'m7'),K('ii',2,2,'m7'),K('V7',5,7,'dom7'),K('I',1,0,'maj7')],how:'Every root moves down a 5th while staying in the key. The one exception is IV to viiø, a tritone, which keeps you inside the scale. This is the movement behind Autumn Leaves and Fly Me to the Moon.'},
  diatmin:{name:'Diatonic cycle (minor)',mode:'min',tex:['rootless','shells','drop2','drop3'],bars:[K('i',1,0,'m7'),K('iv',4,5,'m7'),K('♭VII7',7,10,'dom7'),K('♭III',3,3,'maj7'),K('♭VI',6,8,'maj7'),K('iiø',2,2,'m7b5'),K('V7♭9',5,7,'dom7b9'),K('i',1,0,'m6')],how:'The same cycle in minor. iv to ♭VII7 to ♭III is a ii–V–I in the relative major, and ♭VI to iiø is the tritone step. Then iiø–V–i brings you home. Think Autumn Leaves, second half.'},
};
export const QZ=[
  {c:'V',t:k=>`V of ${keyName(k,'maj')}`,a:k=>k+7},
  {c:'IV',t:k=>`IV of ${keyName(k,'maj')}`,a:k=>k+5},
  {c:'ii',t:k=>`Root of the ii chord in ${keyName(k,'maj')}`,a:k=>k+2},
  {c:'vi',t:k=>`Root of the vi chord in ${keyName(k,'maj')}`,a:k=>k+9},
  {c:'rel',t:k=>`Relative minor of ${keyName(k,'maj')} major`,a:k=>k+9},
  {c:'relmaj',t:k=>`Relative major of ${keyName((k+9)%12,'min')} minor`,a:k=>k},
  {c:'tt',t:k=>`Tritone sub of ${keyName(k,'maj')}7`,a:k=>k+6},
  {c:'bVII',t:k=>`Backdoor ♭VII7 in ${keyName(k,'maj')}`,a:k=>k+10},
  {c:'V/ii',t:k=>`Root of V7/ii in ${keyName(k,'maj')}`,a:k=>k+9},
  {c:'sig',t:k=>`Major key with ${SIG[k]}`,a:k=>k},
];
export const QZ_NAME={V:'V of a key',IV:'IV of a key',ii:'ii chord',vi:'vi chord',rel:'Relative minor',relmaj:'Relative major',tt:'Tritone sub','bVII':'Backdoor ♭VII7','V/ii':'V7 of ii',sig:'Key signatures'};
export function cycleChain(sub,start){const X=CYC[sub];const out=[];for(let i=0;i<X.n;i++){const pc=(start+5*i)%12;
  if(sub==='iiV'){chordsInKey(IIVI,pc,'maj').forEach((c,j)=>out.push({...c,rn:j===0?keyName(pc,'maj'):'',beats:j===2?4:2,nw:false}));}
  else out.push({rn:'',q:'dom7',root:MAJ_NAMES[pc],rootName:keyName(pc,'maj'),pc,sym:keyName(pc,'maj')+'7',beats:sub==='guide'?2:4,nw:false});}return out;}
export const cyclePath=(sub,start)=>Array.from({length:CYC[sub].n},(_,i)=>{const pc=(start+5*i)%12;return sub==='iiV'?keyName(pc,'maj'):keyName(pc,'maj')+'7';});
