const CACHE_NAME = 'eitango-challenge-v15';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
 if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;
 event.respondWith(fetch(event.request, { cache: 'no-store' }).then(response => { const copy=response.clone(); if(response.ok) event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy))); return response; }).catch(()=>caches.match(event.request)));
});
