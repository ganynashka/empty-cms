// @flow

import request from 'request';
import {type BackstopConfigScenarioType} from 'backstopjs';

import {documentApiRouteMap} from '../../../server/src/api/api-route-map';
import type {PromiseResolveType} from '../../../www/js/lib/promise';

async function getLinkList(host: string): Promise<Array<string>> {
    return new Promise((resolve: PromiseResolveType<Array<string>>) => {
        request(
            {
                uri: host + documentApiRouteMap.getDocumentSlugList,
            },
            (error: ?Error, response: Response, body: ?string) => {
                if (body) {
                    resolve(JSON.parse(body));
                    return;
                }
                resolve([]);
            }
        );
    });
}

function linkToScenario(baseUrl: string, link: string): BackstopConfigScenarioType {
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

export async function getScenarioList(baseUrl: string): Promise<Array<BackstopConfigScenarioType>> {
    const linkList = await getLinkList(baseUrl);

    return linkList
        .filter((link: string, index: number): boolean => index % 100 === 0)
        .map<BackstopConfigScenarioType>((link: string): BackstopConfigScenarioType => {
            return linkToScenario(baseUrl, link);
        });
}
