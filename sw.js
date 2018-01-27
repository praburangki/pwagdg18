// Update Me
// var cacheName = 'gdgPWA-v1';
// var filesToCache = [
//   '/',
//   '/index.html',
//   '/scripts/app.js',
//   '/scripts/localforage-1.4.0.js',
//   '/styles/styles.css',
//   '/images/barca.png',
//   '/images/realmadrid.png',
//   '/images/valencia.png',
//   '/images/atletico.png',
//   '/images/delrey.png',
//   '/images/fifa.png',
//   '/images/laliga.png',
//   '/images/ucl.png',
//   '/images/uefa.png',
//   '/images/ic_add_white_24px.svg',
//   '/images/ic_refresh_white_24px.svg'
// ];

// // Caches all the files needed by the app shell
// self.addEventListener('install', function(e) {
//   console.log('[ServiceWorker] Install');
//   e.waitUntil(
//     caches.open(cacheName).then(function(cache) {
//       console.log('[ServiceWorker] Caching app shell');
//       return cache.addAll(filesToCache);
//     })
//   );
// });

// // Purge any of the old and outdated files and always serve the latest
// self.addEventListener('activate', function(e) {
//   console.log('[ServiceWorker] Activate');
//   e.waitUntil(
//     caches.keys().then(function(keyList) {
//       return Promise.all(keyList.map(function(key) {
//         if (key !== cacheName) {
//           console.log('[ServiceWorker] Removing old cache', key);
//           return caches.delete(key);
//         }
//       }));
//     })
//   );
// });

// self.addEventListener('fetch', function(e) {
//   console.log('[ServiceWorker] Fetch', e.request.url);
//   e.respondWith(
//     caches.match(e.request).then(function(response) {
//       return response || fetch(e.request); // Get data from catch, if not available then fetch the request.
//     })
//   );
// });