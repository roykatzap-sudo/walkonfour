/* Service worker של עמוד מצבי החירום בלבד (scope: /emergency).
   מטרה אחת: שהעמוד ייפתח גם בלי קליטה, אחרי שהמשתמש ביקש לשמור אותו.
   רשת קודם; המטמון משמש רק כשאין רשת. לא נוגע בשום עמוד אחר באתר. */
const CACHE = 'kv-emergency-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('kv-emergency-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  const data = event.data || {}
  if (data.type !== 'precache' || !Array.isArray(data.urls)) return
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      let saved = 0
      await Promise.all(
        data.urls.slice(0, 120).map(async (u) => {
          try {
            const url = new URL(u, self.location.origin)
            if (url.origin !== self.location.origin) return
            const res = await fetch(url.href, { credentials: 'same-origin' })
            if (res.ok) {
              await cache.put(url.href, res)
              saved += 1
            }
          } catch (e) {
            /* קובץ אחד שנכשל לא מבטל את השאר */
          }
        }),
      )
      if (event.source) event.source.postMessage({ type: 'precached', saved })
    }),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && (url.pathname === '/emergency' || url.pathname.startsWith('/_next/static/'))) {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {})
        }
        return res
      })
      .catch(async () => {
        const hit = await caches.match(req, { ignoreSearch: req.mode === 'navigate' })
        if (hit) return hit
        if (req.mode === 'navigate') {
          const page = await caches.match(new URL('/emergency', self.location.origin).href)
          if (page) return page
        }
        return Response.error()
      }),
  )
})
