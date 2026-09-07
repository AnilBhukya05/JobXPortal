const CACHE_NAME = "jobxportal-v2";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.svg",
  "/icon-512.svg",
];

const EXCLUDED_HOSTS = [
  "api.adzuna.com",
  "api.groq.com",
  "logo.clearbit.com",
  "remotive.com",
  "jsearch.p.rapidapi.com",
  "www.google.com",
  "icons.duckduckgo.com",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET") return;
  if (url.protocol === "chrome-extension:") return;
  if (EXCLUDED_HOSTS.some((host) => url.hostname.includes(host))) return;
  // Never intercept calls to your own backend API — always go live to the network.
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;

        if (event.request.mode === "navigate") {
          const shell = await caches.match("/index.html");
          if (shell) return shell;
        }

        // Always resolve to a real Response — never return undefined here.
        return new Response("Network error and no cached copy available.", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain" },
        });
      })
  );
});