const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION

const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js"
];

// install for service worker
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing chase : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

// activate event for service worker
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(keyList => {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })
            cacheKeepList.push(CACHE_NAME);
            
            // removes data of older version no longer needed
            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeepList.indexOf(key) === -1) {
                    console.log('deleting cacche : ' + keyList[i] );
                    return caches.delete(keyList[i]);
                }
            }))
        })
    )
});

// fetch event for service worker
self.addEventListener('fetch', function (e) {
    console.log('fetch request: ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request) {
            //if caches is available, respond with cache
            if (request) {
                console.log('responding with cache : ' + e.request.url);
                return request
            }   //else, tries fetching request
                else {
                    console.log('file is not cache. Fetching : ' + e.request.url);
                    return fetch(e.request)
            }
        })
    )
});