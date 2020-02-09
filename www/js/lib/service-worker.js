// @flow

/* global navigator */

export function registerServiceWorker() {
    if (typeof navigator === 'undefined') {
        return;
    }

    const {serviceWorker} = navigator;

    if (!serviceWorker) {
        return;
    }

    const {log} = console;

    serviceWorker
        .register('/sw.js', {scope: '/'})
        .then((): mixed => log('Service Worker registered successfully.'))
        .catch((error: Error): Error => {
            console.log('Service Worker registration failed:', error);
            console.log(error);
            return error;
        });
}
