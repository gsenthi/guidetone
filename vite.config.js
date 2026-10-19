import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig({
  plugins:[
    react(),
    VitePWA({
      registerType:'autoUpdate',
      includeAssets:['favicon.svg','apple-touch-icon.png'],
      manifest:{
        name:'Guide Tone',
        short_name:'Guide Tone',
        description:'Jazz piano practice in all 12 keys: a smart 15-minute daily warm-up.',
        lang:'en-GB',
        start_url:'/',
        scope:'/',
        display:'standalone',
        orientation:'portrait',
        background_color:'#ECEFF3',
        theme_color:'#2944C2',
        icons:[
          {src:'pwa-192.png',sizes:'192x192',type:'image/png'},
          {src:'pwa-512.png',sizes:'512x512',type:'image/png'},
          {src:'pwa-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'},
        ],
      },
      workbox:{
        globPatterns:['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        // Google Fonts: cache the stylesheet and the font files so the app looks right offline.
        runtimeCaching:[
          {urlPattern:({url})=>url.origin==='https://fonts.googleapis.com',handler:'StaleWhileRevalidate',options:{cacheName:'google-fonts-css'}},
          {urlPattern:({url})=>url.origin==='https://fonts.gstatic.com',handler:'CacheFirst',options:{cacheName:'google-fonts',expiration:{maxEntries:30,maxAgeSeconds:60*60*24*365},cacheableResponse:{statuses:[0,200]}}},
        ],
      },
    }),
  ],
  test:{include:['tests/**/*.test.js']},
});
