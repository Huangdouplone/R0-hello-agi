/* R0:hello agi Service Worker —— 提供离线缓存
 * 通过 http(s) 托管本目录时自动生效；file:// 直接打开时浏览器会拒绝注册，属正常现象。
 */
const CACHE = "r0-hello-agi-v6";
/* ASSETS 必须与 index.html 里 <script src> 的 URL 逐字符一致（含 ?v=N 查询串）：
   缓存以「完整请求 URL」为键，裸文件名匹配不上带查询串的请求，会导致离线时取不到这些资源。 */
const ASSETS = ["./", "index.html", "README.md", "LICENSE.md", "cpp-extra-data.js", "lang-en.js?v=15", "agi-quiz-extra.js?v=1", "agi-lab-extra.js?v=2", "agi-extra2.js?v=1", "agi-lab-extra2.js?v=1", "agi-lab-en.js?v=1", "cpp-sw.js"];
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // 逐个 add：任一资源缺失只跳过它自己，不会让整批预缓存失败
      return Promise.all(ASSETS.map(function (u) {
        return c.add(u).catch(function () {});
      }));
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
