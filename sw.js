// Caches the app so it opens instantly and without internet.
const CACHE = "seven-daily-v6";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-512.png", "splash-1170x2532.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache first, so the app appears immediately (no waiting on the network = no white flash).
// In the background it fetches the latest version, which is used next time the app opens.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then(c =>
      c.match(e.request, { ignoreSearch: true }).then(cached => {
        const fresh = fetch(e.request)
          .then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; })
          .catch(() => cached || c.match("index.html"));
        return cached || fresh;
      })
    )
  );
});
