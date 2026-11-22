// Lava Ledge offline support. Always tries the internet first, so updates show up right away.
// The saved copy is only used when there is no connection.
const CACHE='lava-ledge-v2';
const FILES=['./','manifest.webmanifest','icon-192.png','icon-512.png','music/climb.mp3','music/boss.mp3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(u.pathname.endsWith('version.json'))return; // the update check must always be live
  const key=r.mode==='navigate'?'./':r;
  e.respondWith(fetch(r).then(res=>{if(res.status===200){const cp=res.clone();caches.open(CACHE).then(c=>c.put(key,cp));}return res;})
    .catch(()=>caches.match(key,{ignoreSearch:true}).then(m=>m||Response.error())));
});
