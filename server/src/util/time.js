// @flow

/* global setTimeout */

function getTimezoneOffsetMS(): number {
    const date = new Date();

    return date.getTimezoneOffset() * 60 * 1000;
}

export function getTime(): number {
    const date = new Date();

    return date.getTime() + getTimezoneOffsetMS();
}

export function timeToHumanString(time: number): string {
    return new Date(time - getTimezoneOffsetMS())
        .toISOString()
        .replace(/\.\d{3}Z$/, '')
        .replace('T', ' ');
}

export function waitForTime(timeInMs: number): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
        setTimeout(resolve, timeInMs);
    });
}

export function waitForCallback(callBack: () => boolean): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
        (function waiter() {
            if (callBack()) {
                resolve();
                return;
            }

            setTimeout(waiter, 1e3);
        })();
    });
}
