// Update Me
var cacheName = 'gdgPWA-v2'; // upgrade cacheName
var dataCacheName = 'gdgData-v2'; // add dataCachename

var filesToCache = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/localforage-1.4.0.js',
  '/styles/styles.css',
  '/images/barca.png',
  '/images/realmadrid.png',
  '/images/valencia.png',
  '/images/atletico.png',
  '/images/delrey.png',
  '/images/fifa.png',
  '/images/laliga.png',
  '/images/ucl.png',
  '/images/uefa.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg'
];
// Update Me
var apiBaseURL =
    'https://raw.githubusercontent.com/praburangki/pwagdg18/master/data/';

// Caches all the files needed by the app shell
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

// Purge any of the old and outdated files and always serve the latest
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) { // so it does not delete the data cache
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Update Me
self.addEventListener('fetch', function(e) {
  if (e.request.url.startsWith(apiBaseURL)) { // if starts with api url
    e.respondWith(
      fetch(e.request) // fetch data
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            cache.put(e.request.url, response.clone()); // clone and put it in the cache
            console.log('[ServiceWorker] Fetched & Cached', e.request.url);
            return response;
          });
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        console.log('[ServiceWorker] Fetch Only', e.request.url);
        return response || fetch(e.request);
      })
    );
  }
});