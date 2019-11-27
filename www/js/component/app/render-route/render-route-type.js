// @flow

export type RouteItemType = {|
    +path: string,
    +staticPartPath?: string,
    // eslint-disable-next-line id-match
    +component: React$ComponentType<*>,
    // eslint-disable-next-line id-match
    +asyncLoad?: () => Promise<React$ComponentType<*>>,
    +type: 'route',
|};

export type RedirectItemType = {|
    +from: string,
    +path: string,
    +staticPartPath?: string,
    +type: 'redirect',
|};
