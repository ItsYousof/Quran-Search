self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('static-cache').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles/style.css',
          '/js/script.js',
          '/android-icon-36x36.png',
          '/android-icon-48x48.png',
          '/android-icon-72x72.png',
          '/android-icon-96x96.png',
          '/android-icon-144x144.png',
          '/android-icon-192x192.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  