// @flow

export type ScenarioType = {|
    +label: string,
    +url: string,
    +hideSelectors: Array<string>,
    +removeSelectors: Array<string>,
    +selectors: Array<string>,
    +readyEvent: string,
    +delay: number,
    +misMatchThreshold: number,
    +onBeforeScript: string,
    +onReadyScript: string,
|};
