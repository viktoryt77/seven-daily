// Retired. This replaces the old offline worker on phones that still have it:
// it deletes the saved copies, removes itself, and lets the app load normally.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.registration.unregister())
));
