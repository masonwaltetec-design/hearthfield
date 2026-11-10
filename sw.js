// Hearthfield offline support. Pages load fresh when online (no-cache skips GitHub's 10-minute browser cache), so updates arrive on the next open.
const CACHE='hearthfield-v6';
const APPS=['bram','wren','otto','juniper'];
const SHELL=['./','./index.html','./manifest.webmanifest',...APPS.map(a=>'./manifest-'+a+'.webmanifest'),...APPS.flatMap(a=>['./icons/'+a+'-192.png','./icons/'+a+'-512.png']),'./icons/hearthfield-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c)).catch(()=>{});return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))))});
self.addEventListener('notificationclick',e=>{e.notification.close();const a=(e.notification.data&&e.notification.data.app)||'';
  e.waitUntil(self.clients.matchAll({type:'window'}).then(list=>{for(const c of list){if('focus' in c){c.postMessage({app:a});return c.focus()}}return self.clients.openWindow('./?app='+a)}))});
