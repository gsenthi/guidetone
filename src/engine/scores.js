/* Scores are 1–10. Older saved data used nailed/shaky/missed, which map to 9/5/2. */
export const LEGACY={nailed:9,shaky:5,missed:2};
export const sv=r=>typeof r==='number'?r:(LEGACY[r]??5);
export const val=r=>(sv(r)-1)/9;
export const toScore=m=>Math.round(1+m*9);
export function mastery(st){if(!st||!st.hist||!st.hist.length)return null;const h=st.hist.slice(-4);let s=0,w=0;h.forEach((r,i)=>{s+=val(r)*(i+1);w+=i+1;});return s/w;}
export const mBand=m=>{if(m==null)return'';const x=1+m*9;return x<3.5?'m0':x<6.5?'m1':x<8.5?'m2':'m3';};
export const sBand=x=>x<=3?'m0':x<=6?'m1':x<=8?'m2':'m3';
