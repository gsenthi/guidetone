/* Rhythm & time: metronome feel/subdivision drills and the two-bar reading patterns (x = note, . = rest, in quavers). */
export const RH={
  tf24:{name:'Click on 2 & 4',mode:'24',bpm:100,kind:'feel',desc:'The click is the drummer’s hi-hat on 2 and 4. Swing quavers through today’s scale or comp a ii–V, and lean into the backbeat.'},
  tfgap:{name:'Bar on, bar off',mode:'gap',bpm:100,kind:'feel',desc:'The click plays one bar, then drops out for a bar. Keep swinging through the gap and land beat 1 together when it returns.'},
  tf4:{name:'Click on 4 only',mode:'b4',bpm:92,kind:'feel',desc:'Only beat 4 sounds. You hold beats 1 to 3 yourself. Count out loud at first.'},
  tfbar2:{name:'Beat 1 every other bar',mode:'bar2',bpm:120,kind:'feel',desc:'One click every two bars. This is how it feels when the band is laying out. Keep your own time.'},
  tfand4:{name:'Click on the “and” of 4',mode:'and4',bpm:90,kind:'feel',desc:'The click is the swung upbeat just before each bar. Hear it as a pickup into beat 1, not as a downbeat.'},
  sd83:{name:'Quavers ↔ triplets',mode:'sd83',bpm:72,kind:'sub',desc:'Alternate one bar of straight quavers with one bar of triplet quavers on a single note or a scale. Turn the guide clicks off once it is steady.'},
  sdsw:{name:'Straight ↔ swung quavers',mode:'sdSwing',bpm:110,kind:'sub',desc:'Two bars straight, two bars swung. Feel the upbeat move later in the swung bars without the downbeat moving.'},
  sdlad:{name:'Subdivision ladder',mode:'sdLadder',bpm:63,kind:'sub',desc:'Bar 1 crotchets, bar 2 quavers, bar 3 triplets, bar 4 semiquavers, then back down. Same note, even tone.'},
  sd32:{name:'3 against 2',mode:'sd32',bpm:66,kind:'sub',desc:'Left hand taps the beat, right hand plays three evenly across every two beats. Say “not dif-fi-cult” to lock it in.'},
  sd34:{name:'3 against 4',mode:'sd34',bpm:56,kind:'sub',desc:'Left hand plays four crotchets, right hand plays three evenly across the bar. Slow is fine. Accuracy first.'},
};
export const READ=[
  {p:'x.x.x.x.x.x.xxx.',lvl:1},{p:'x.xxx.x.x.xxx.x.',lvl:1},{p:'xxx.x.x.xxx.x...',lvl:1},
  {p:'x..x....x..x....',lvl:2,name:'Charleston'},{p:'x..x..x.x..x..x.',lvl:1},
  {p:'x.x.x..x..x.x...',lvl:2,name:'Anticipating beat 1'},{p:'x...x..xx...x..x',lvl:2},
  {p:'x.xx.x..x.xx.x..',lvl:2},{p:'...x..x....x..x.',lvl:2},{p:'x.x..x...x.x..x.',lvl:2},
  {p:'.x.x.x.x.x.x.x.x',lvl:3,name:'All upbeats'},{p:'x..x..x..x..x..x',lvl:3,name:'Hemiola'},
  {p:'.x..x..x.x..x..x',lvl:3},{p:'..x..x.x..x..x.x',lvl:3},{p:'.xx.x.xx.x..xx.x',lvl:3},
];
export const READ_BPM={1:84,2:96,3:108};
