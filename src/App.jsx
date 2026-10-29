import {useEffect,useLayoutEffect,useSyncExternalStore} from 'react';
import {state} from './engine/store.js';
import {UI,subscribe,getVersion,go} from './ui.js';
import {Today} from './views/Today.jsx';
import {Session,Summary} from './views/Session.jsx';
import {Library} from './views/Library.jsx';
import {Progress} from './views/Progress.jsx';
import {Settings} from './views/Settings.jsx';

const VIEWS={today:Today,session:Session,summary:Summary,library:Library,progress:Progress,settings:Settings};
const TABS=[['today','Today'],['library','Library'],['progress','Progress'],['settings','Settings']];

export function App(){useSyncExternalStore(subscribe,getVersion);
  useLayoutEffect(()=>{document.documentElement.dataset.look=state.settings.look||'colour';});
  /* Space bar taps along in rhythm reading. */
  useEffect(()=>{const onKey=e=>{if(UI.view==='session'&&UI.read.phase==='run'&&(e.code==='Space'||e.key===' ')){e.preventDefault();UI.read.tapFn&&UI.read.tapFn();}};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey);},[]);
  const View=VIEWS[UI.view];const tabView=UI.view==='session'||UI.view==='summary'?'today':UI.view;
  return <>
    <div className="wrap">
      <header className="top">
        <div className="brand">Guide Tone<small>Jazz piano · all 12 keys</small></div>
        <nav className="tabs" id="tabs" aria-label="Sections">{TABS.map(([v,l])=><button key={v} aria-current={v===tabView?'page':undefined} onClick={()=>go(v)}>{l}</button>)}</nav>
      </header>
      <main id="main"><View/></main>
    </div>
    <div className="toast" id="toast" hidden={!UI.toast}>{UI.toast}</div>
  </>;}
