// @flow

import request from 'request';

import {documentApiRouteMap} from '../../../server/src/api/api-route-map';
import type {PromiseResolveType} from '../../../www/js/lib/promise';

import type {ScenarioType} from './backstop-type';

async function getLinkList(host: string): Promise<Array<string>> {
    return new Promise((resolve: PromiseResolveType<Array<string>>) => {
        request(
            {
                uri: host + documentApiRouteMap.getDocumentSlugList,
            },
            (error: Error | mixed, response: Response, body: string) => {
                resolve(JSON.parse(body));
            }
        );
    });
}

function linkToScenario(baseUrl: string, link: string): ScenarioType {
    const url = baseUrl + link;

    return {
        url,
        label: url,
        hideSelectors: [],
        removeSelectors: [],
        selectors: ['body'],
        readyEvent: '',
        delay: 0,
        misMatchThreshold: 0,
        onBeforeScript: '',
        onReadyScript: '',
    };
}

export async function getScenarioList(baseUrl: string): Promise<Array<ScenarioType>> {
    const linkList = await getLinkList(baseUrl);

    return linkList
        .filter((link: string, index: number): boolean => index % 100 === 0)
        .map<ScenarioType>((link: string): ScenarioType => {
            return linkToScenario(baseUrl, link);
        });
}
