var cacheName = 'pwaTeste+-v1.2';

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

self.addEventListener('fetch', function (event) {
  //Atualizacao internet
  event.respondWith(async function () {
     try {
       return await fetch(event.request);
     } catch (err) {
       return caches.match(event.request);
     }
   }());

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