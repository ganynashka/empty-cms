// @flow

/* global self, caches, fetch */

/* eslint-disable spaced-comment, arrow-parens, flowtype/require-parameter-type, flowtype/require-return-type */

/*::
type ServiceWorkerEvent = {
    ...Event,
    waitUntil: (waitFor: Promise<mixed>) => mixed,
    respondWith: (respondFor: Promise<mixed>) => mixed,
    request: Request,
};
*/

const cacheName = 'my-pwa-cache-v.0040';

async function makePreCache() {
    const cache = await caches.open(cacheName);

    await cache.addAll(['/']);
}

function installCallBack(evt /*:: : ServiceWorkerEvent */) {
    evt.waitUntil(makePreCache());
}

self.addEventListener('install', installCallBack);

async function updateCache(evt /*:: : ServiceWorkerEvent */) {
    const {request} = evt;
    const cache = await caches.open(cacheName);
    const response = await fetch(request);

    console.log('[PWA Builder] add page to offline ' + response.url);

    await cache.put(request, response);
}

async function fetchRespondWith(evt /*:: : ServiceWorkerEvent */) {
    return fetch(evt.request).catch(async (error /*:: : Error */) /*:: : Promise<mixed> */ => {
        console.log('[PWA Builder] Network request Failed. Serving content from cache: ' + error.message);
        const cache = await caches.open(cacheName);
        const matching = await cache.match(evt.request);

        if (!matching || String(matching.status) === '404') {
            console.log('---> matching is wrong', matching);
            throw new Error('no-match');
        }

        return matching;
    });
}

// eslint-disable-next-line complexity
async function fetchCallBack(evt /*:: : ServiceWorkerEvent */) {
    const {request} = evt;
    const {url} = request;

    // url.includes('/upload-file/') ||

    if (
        url.includes('/api/')
        || url.includes('/static/')
        || url.includes('/article/')
        || url === 'https://localhost/'
        || url === 'https://skazki.land/'
    ) {
        evt.waitUntil(updateCache(evt));
        evt.respondWith(fetchRespondWith(evt));
    }
}

self.addEventListener('fetch', fetchCallBack);
