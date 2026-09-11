// 中秋亲子路书 · 离线缓存 Service Worker
// 策略：导航请求网络优先（强制绕过 HTTP 缓存，保证线上更新立刻传到），离线回退缓存；
//      静态资源（图片/图标）缓存优先，首次在线浏览后写入，之后断网也能开；
//      跨域请求（Open-Meteo 天气）不缓存，直接走网络。
const CACHE = 'roadbook-v20260911-1015';
const CORE = ['./', './index.html'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(CORE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 跨域（天气 API）不缓存

  if (req.mode === 'navigate') {
    // 关键：cache:'no-cache' 绕过 CDN/浏览器 HTTP 缓存，每次都向网络拿最新 index.html
    e.respondWith(
      fetch(req, { cache: 'no-cache' }).then(function (res) {
        if (res.ok) {
          var cp = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, cp); });
        }
        return res;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match('./index.html'); });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (r) {
      if (r) return r;
      return fetch(req).then(function (res) {
        // 守卫：只有成功响应才进缓存，避免 404/5xx 被 SW 永久缓存（曾导致缩略图空白）
        if (res.ok) {
          var cp = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, cp); });
        }
        return res;
      }).catch(function () { return r; });
    })
  );
});
