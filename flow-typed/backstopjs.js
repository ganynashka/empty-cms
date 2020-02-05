// @flow

declare module 'backstopjs' {
    declare type BackstopConfigViewportType = {|
        +name: string,
        +width: number,
        +height: number,
    |};

    declare export type BackstopConfigScenarioType = {|
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

    declare export type BackstopConfigReportFormatType = 'browser' | 'CI' | 'json';
    declare export type BackstopConfigEngineType = 'puppeteer' | 'chromy';

    declare export type BackstopConfigType = {|
        +id: string,
        +viewports: Array<BackstopConfigViewportType>,
        +scenarios: Array<BackstopConfigScenarioType>,
        +engine: BackstopConfigEngineType,
        +paths: {|
            /* eslint-disable camelcase, id-match */
            +bitmaps_reference: string,
            +bitmaps_test: string,
            +html_report: string,
            +ci_report: string,
            /* eslint-enable camelcase, id-match */
        |},
        +report: Array<BackstopConfigReportFormatType>,
        +resembleOutputOptions: {
            +ignoreAntialiasing?: boolean,
        },
        +debug: boolean,
    |};

    declare export type BackstopRunOptionType = {
        +config: BackstopConfigType,
    };

    declare type BackstopRunTypeNameType = 'init' | 'test' | 'approve';

    declare export default (type: BackstopRunTypeNameType, option: BackstopRunOptionType) => mixed;
}
