// @flow

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
        .replace('Z', '')
        .replace(/\.\d{3}$/, '')
        .replace('T', ' ');
}
