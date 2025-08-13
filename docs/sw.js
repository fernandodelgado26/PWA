const CACHE = "app-v1";

const PRECACHE_URLS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "sw-register.js",
  "firebase-config.js",
  "icon-192.png",
  "icon-512.png",
  "maskable-512.png",

  "Home/Home.html",
  "Home/Home.css",
  "Home/Home.JS",

  "Login/Login.html",
  "Login/Login.css",
  "Login/Login.js",

  "Productos/productos.html",
  "Productos/producto.css",
  "Productos/producto.js",

  "Acerca/acerca.html",
  "Acerca/acerca.css",
  "Acerca/acerca.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Navegación: offline-first a index
self.addEventListener("fetch", (e) => {
  const req = e.request;

  // Para peticiones de página (navigate) servimos index offline si hace falta
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() => caches.match("index.html"))
    );
    return;
  }

  // Resto: cache first, fallback a red
  e.respondWith(
    caches.match(req).then((r) => r || fetch(req))
  );
});
