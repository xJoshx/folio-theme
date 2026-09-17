const CACHE_NAME = "wada-theme-lab-v2";
const START_URL = "/theme-lab-prototype/";
const CORE_URLS = [START_URL, "/theme-lab.webmanifest", "/favicon.svg"];

const cachePageAssets = async (cache) => {
  const response = await fetch(START_URL);
  if (!response.ok) return;
  await cache.put(START_URL, response.clone());

  const html = await response.text();
  const assetUrls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => new URL(match[1], self.location.origin))
    .filter((url) => url.origin === self.location.origin)
    .map((url) => url.pathname);

  await Promise.allSettled([...new Set(assetUrls)].map((url) => cache.add(url)));
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(CORE_URLS.map((url) => cache.add(url)));
      await cachePageAssets(cache);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith("wada-theme-lab-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        const response = await fetch(event.request);
        if (response.ok) await cache.put(event.request, response.clone());
        return response;
      } catch (error) {
        const cached = await cache.match(event.request, {
          ignoreSearch: event.request.mode === "navigate"
        });
        if (cached) return cached;

        if (event.request.mode === "navigate") {
          const fallback = await cache.match(START_URL);
          if (fallback) return fallback;
        }
        throw error;
      }
    })()
  );
});
