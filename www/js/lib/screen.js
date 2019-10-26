// @flow

/* global window, requestAnimationFrame, Event */

export async function forceResize(): Promise<void> {
    return new Promise((resolve: () => void) => {
        requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'));
            requestAnimationFrame(resolve);
            console.log('resized');
        });
    });
}
