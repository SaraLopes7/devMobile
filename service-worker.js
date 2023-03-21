var cacheName = 'pwaTeste+-v1.2';

const HOSTNAME_WHITELIST = [
  self.location.hostname,
  'fonts.gstatic.com',
  'fonts.googleapis.com',
  'cdn.jsdelivr.net'
]

const getFixedUrl = (req) => {
  var now = Date.now()
  var url = new URL(req.url)

  url.protocol = self.location.protocol

  if (url.hostname === self.location.hostname) {
      url.search += (url.search ? '&' : '?') + 'cache-bust=' + now
  }
  return url.href
}

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})


self.addEventListener('install', event => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll([

        './index.html',
        './single.html',

        './assets/css/fontawesome-all.min.css',
        './assets/css/main.css',

        './assets/js/breakpoints.min.js',
        './assets/js/browser.min.js',
        './assets/js/jquery.min.js',
        './assets/js/main.js',
        './assets/js/util.js',

        './assets/img/avatar.jpg',
        './assets/img/logo.jpg',
        './assets/img/pic01.jpg',
        './assets/img/pic02.jpg',
        './assets/img/pic03.jpg',
        './assets/img/pic04.jpg',
        './assets/img/pic05.jpg',
        './assets/img/pic06.jpg',
        './assets/img/pic07.jpg',
        './assets/img/pic08.jpg',
        './assets/img/pic09.jpg',
        './assets/img/pic10.jpg',
        './assets/img/pic11.jpg',
        './assets/img/pic12.jpg',
      ]))
  );
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
// Skip some of cross-origin requests, like those for Google Analytics.
if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
    // Stale-while-revalidate
    // similar to HTTP's stale-while-revalidate: https://www.mnot.net/blog/2007/12/12/stale
    // Upgrade from Jake's to Surma's: https://gist.github.com/surma/eb441223daaedf880801ad80006389f1
    const cached = caches.match(event.request)
    const fixedUrl = getFixedUrl(event.request)
    const fetched = fetch(fixedUrl, { cache: 'no-store' })
    const fetchedCopy = fetched.then(resp => resp.clone())

    // Call respondWith() with whatever we get first.
    // If the fetch fails (e.g disconnected), wait for the cache.
    // If there’s nothing in cache, wait for the fetch.
    // If neither yields a response, return offline pages.
    event.respondWith(
    Promise.race([fetched.catch(_ => cached), cached])
        .then(resp => resp || fetched)
        .catch(_ => { /* eat any errors */ })
    )

    // Update the cache with the version we fetched (only for ok status)
    event.waitUntil(
    Promise.all([fetchedCopy, caches.open("pwa-cache")])
        .then(([response, cache]) => response.ok && cache.put(event.request, response))
        .catch(_ => { /* eat any errors */ })
    )

    event.respondWith(async function () {
      try {
        return await fetch(event.request);
      } catch (err) {
        return caches.match(event.request);
      }
    }());
}

  //Atualizacao cache
  /*event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );*/

});