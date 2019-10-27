// @flow

export function getTime(): number {
    const date = new Date();

    return date.getTime() + date.getTimezoneOffset() * 60 * 1000;
}
