const CACHE_NAME = "nexos-static-v7";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./nexos_logo.png", "./nexos_symbol.png"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith("/index.html") || url.pathname.endsWith("/") || url.pathname.endsWith("/sw.js") || url.pathname.endsWith("/manifest.webmanifest")) {
    event.respondWith(fetch(event.request, {cache:"no-store"}).then(r => { const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(event.request,copy)); return r; }).catch(() => caches.match(event.request).then(r => r || caches.match("./index.html"))));
  } else {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(r => { const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(event.request,copy)); return r; })));
  }
});
