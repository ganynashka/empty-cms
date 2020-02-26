// @flow

export function getRandom(fromInclude: number, toExclude: number): number {
    return fromInclude + Math.floor(Math.random() * (toExclude - fromInclude));
}
