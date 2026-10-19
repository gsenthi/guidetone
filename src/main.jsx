import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import {load} from './engine/store.js';
import {App} from './App.jsx';
import './styles.css';

load();
createRoot(document.getElementById('root')).render(<App/>);
registerSW({immediate:true});
