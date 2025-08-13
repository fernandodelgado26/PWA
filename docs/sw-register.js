// docs/sw.js
const CACHE = "app-v3"; // súbelo si haces cambios (v4, v5...)

const ESSENTIAL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "sw-register.js",
  "icon-192.png",
  "icon-512.png",
  "maskable-512.png"
];

// Intenta cachear lo esencial, pero NO rompas si algo falla
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      try {
        const c = await caches.open(CACHE);
        await Promise.all(
          ESSENTIAL.map(async (u) => {
            try { await c.add(u); } catch (err) { /* ignora 404/case */ }
          })
        );
      } catch (e) {
        // no pasa nada: seguimos
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null)));
    })()
  );
  self.clients.claim();
});

// Soporte mínimo de fetch (requisito de PWA): cache-first y fallback a red
self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      if (r) return r;
      try { return await fetch(e.request); } catch (err) {
        // Si es navegación y falla red, sirve el index (offline)
        if (e.request.mode === "navigate") return caches.match("index.html");
        throw err;
      }
    })()
  );
});
