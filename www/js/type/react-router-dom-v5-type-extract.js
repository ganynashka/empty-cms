// @flow

export type LocationType = {
    pathname: string,
    search: string,
    hash: string,
    state?: mixed,
    key?: string,
    ...,
};

export type LocationShapeType = {
    pathname?: string,
    search?: string,
    hash?: string,
    state?: mixed,
    ...,
};

export type HistoryActionType = 'PUSH' | 'REPLACE' | 'POP';

export type RouterHistoryType = {
    length: number, // WARNING: in original file -> "length: number",
    location: LocationType,
    action: HistoryActionType,
    listen(callback: (location: LocationType, action: HistoryActionType) => void): () => void,
    push(path: string | LocationShapeType, state?: mixed): void,
    replace(path: string | LocationShapeType, state?: mixed): void,
    go(n: number): void,
    goBack(): void,
    goForward(): void,
    canGo?: (n: number) => boolean,
    block(callback: string | ((location: LocationType, action: HistoryActionType) => ?string)): () => void,
    // createMemoryHistory
    index?: number,
    entries?: Array<LocationType>,
    ...,
};

export type MatchType = {
    params: {[key: string]: ?string, ...},
    isExact: boolean,
    path: string,
    url: string,
    ...,
};

export type StaticRouterContextType = {url?: string, ...};

export type ContextRouterType = {|
    history: RouterHistoryType,
    location: LocationType,
    match: MatchType | null, // WARNING: in original file -> "match: MatchType",
    staticContext?: StaticRouterContextType,
|};

export type GetUserConfirmationType = (message: string, callback: (confirmed: boolean) => void) => void;
