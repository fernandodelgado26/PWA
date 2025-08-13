// sw.js
const CACHE_NAME = "app-v1";

// Archivos que quieres disponibles offline (ajusta rutas reales)
const PRECACHE_URLS = [
  "/",               // si tu servidor resuelve / a /index.html
  "/index.html",
  "/Home/Home.html",
  "/Home/Home.css",
  "/Home/Home.js",   // si renombraste
  "/Login/Login.html",
  "/Login/Login.css",
  "/Login/Login.js",
  "/Productos/productos.html",
  "/Productos/producto.css",
  "/Productos/producto.js",
  "/Acerca/acerca.html",
  "/Acerca/acerca.css",
  "/Acerca/acerca.js",
  "/firebase-config.js",
  "/icon-192.png",
  "/icon-512.png",
  "/maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Navegación (HTML): Network first con fallback a cache
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Estáticos: Cache first
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
      );
    })
  );
});
