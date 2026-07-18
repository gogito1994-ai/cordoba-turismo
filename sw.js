const CACHE_NAME = "cordoba-v7";

const APP_SHELL = [
  "index.html",
  "lugares.html",
  "lugar.html",
  "mapa.html",
  "planificar.html",
  "eventos.html",
  "gastronomia.html",
  "transporte.html",
  "buscar.html",
  "recomendados.html",
  "aviso-legal.html",
  "estancia.html",
  "bienvenida.html",
  "planes-calor.html",
  "css/styles.css",
  "js/config.js",
  "js/data.js",
  "js/map-data.js",
  "js/events-data.js",
  "js/gastronomia-data.js",
  "js/icons.js",
  "js/i18n-ui.js",
  "js/i18n-data.js",
  "js/favorites.js",
  "js/lang.js",
  "js/app.js",
  "js/lugares.js",
  "js/lugar.js",
  "js/mapa.js",
  "js/planificador.js",
  "js/eventos.js",
  "js/gastronomia.js",
  "js/transporte.js",
  "js/buscar.js",
  "js/chat.js",
  "js/partners.js",
  "js/afiliados.js",
  "js/estancia.js",
  "js/bienvenida.js",
  "data/partners.json",
  "data/afiliados.json",
  "data/extras.json",
  "manifest.json",
  "icons/favicon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Navegación entre páginas: red primero, con la caché como respaldo offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("index.html")))
    );
    return;
  }

  // Recursos propios del sitio: caché primero, actualizando en segundo plano.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Teselas del mapa (OpenStreetMap) y fotos (Wikimedia Commons): se cachean
  // según se van visitando, para que la zona ya explorada funcione sin conexión.
  if (url.hostname.includes("tile.openstreetmap.org") || url.hostname.includes("upload.wikimedia.org")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req)
            .then((res) => {
              cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
        })
      )
    );
  }
});
