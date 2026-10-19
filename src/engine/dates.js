export const pad2=n=>String(n).padStart(2,'0');
export const ymd=(d=new Date())=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
export const dayNum=(s=ymd())=>{const[y,m,d]=s.split('-').map(Number);return Math.round(Date.UTC(y,m-1,d)/864e5);};
export const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
