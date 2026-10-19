/* Note spelling: every note name comes from spell(), never from a flat/sharp lookup. */
export const LETTERS=['C','D','E','F','G','A','B'], NAT=[0,2,4,5,7,9,11];
export const MAJ_NAMES=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
export const MIN_NAMES=['C','C#','D','Eb','E','F','F#','G','G#','A','Bb','B'];
export const CYCLE4=[0,5,10,3,8,1,6,11,4,9,2,7];
export const CYCLE5=[0,7,2,9,4,11,6,1,8,3,10,5];
export const ORDER_INTRO=[0,5,7,10,2,3,9,8,4,1,11,6];
export const ACC_U={'-2':'𝄫','-1':'♭','0':'','1':'♯','2':'𝄪'}, ACC_A={'-2':'bb','-1':'b','0':'','1':'#','2':'##'};
export const SIG={0:'no sharps or flats',7:'1 sharp',2:'2 sharps',9:'3 sharps',4:'4 sharps',11:'5 sharps',6:'6 sharps',1:'5 flats',8:'4 flats',3:'3 flats',10:'2 flats',5:'1 flat'};
export const pretty=n=>n[0]+n.slice(1).replace(/##/g,'𝄪').replace(/bb/g,'𝄫').replace(/b/g,'♭').replace(/#/g,'♯');
export function parseNote(n){const li=LETTERS.indexOf(n[0]);let acc=0;for(const c of n.slice(1)){if(c==='b')acc--;else if(c==='#')acc++;}return{li,acc,pc:((NAT[li]+acc)%12+12)%12};}
export function spell(root,deg,semis){const r=parseNote(root);const li=(r.li+deg-1)%7;const pc=((r.pc+semis)%12+12)%12;let acc=pc-NAT[li];if(acc>6)acc-=12;if(acc<-6)acc+=12;return{name:LETTERS[li]+(ACC_U[acc]??'?'),ascii:LETTERS[li]+(ACC_A[acc]??''),pc};}
export const asciiName=(pc,mode)=>(mode==='min'?MIN_NAMES:MAJ_NAMES)[pc];
export const keyName=(pc,mode)=>pretty(asciiName(((pc%12)+12)%12,mode));
export const hasDouble=s=>/[𝄫𝄪]/.test(s);
export function nearest(pc,target){let m=target-(((target-pc)%12)+12)%12;if(target-m>6)m+=12;return m;}
export function placeList(root,list,bottom){const out=[];let prev=null;list.forEach(([d,s],i)=>{const n=spell(root,d,s);if(hasDouble(n.name))n.name=pretty(MAJ_NAMES[n.pc]);const m=i===0?nearest(n.pc,bottom):prev+1+(((n.pc-(prev+1))%12)+12)%12;out.push({name:n.name,pc:n.pc,midi:m});prev=m;});return out;}
export function degLabel([d,s]){const nat=[0,2,4,5,7,9,11][(d-1)%7];let diff=((s-nat)%12+12)%12;if(diff>6)diff-=12;return(ACC_U[diff]??'')+d;}
