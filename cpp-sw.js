/* R0:hello agi Service Worker —— 提供离线缓存
 * 通过 http(s) 托管本目录时自动生效；file:// 直接打开时浏览器会拒绝注册，属正常现象。
 */
const CACHE = "r0-hello-agi-v2";
const ASSETS = ["./", "index.html", "cpp-extra-data.js", "lang-en.js", "agi-quiz-extra.js", "agi-lab-extra.js", "cpp-sw.js"];
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(ASSETS).catch(function () {});
    }).then(function () { return self.skipWaiting(); })
  );
});
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (r) {
      return r || fetch(e.request).then(function (resp) {
        var cp = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, cp); });
        return resp;
      }).catch(function () { return caches.match("index.html"); });
    })
  );
});
