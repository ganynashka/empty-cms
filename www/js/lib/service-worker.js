// @flow

/* global navigator */

const {isDevelopment} = require('./../../../webpack/config');

export function registerServiceWorker() {
    if (isDevelopment) {
        return;
    }

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
