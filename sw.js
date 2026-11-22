// Блокнот: офлайн-режим и установка на телефон.
// Если заменишь файлы на новую версию, увеличь номер версии, чтобы телефон точно забыл старый кэш.
const CACHE = "bloknot-v2";
const SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./config.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    // Свои файлы: сначала сеть (обновления приходят сразу), без сети — из кэша.
    e.respondWith(
      fetch(req)
        .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
        .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
  } else if (url.hostname === "www.gstatic.com" || url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    // Библиотека Firebase и шрифты не меняются: сначала кэш.
    e.respondWith(
      caches.match(req).then(r => r || fetch(req).then(res => {
        if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
// Нажатие на уведомление открывает блокнот.
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow ? self.clients.openWindow("./") : null;
  }));
});
