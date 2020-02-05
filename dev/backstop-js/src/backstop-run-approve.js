// @flow

import backstop from 'backstopjs';

import {baseUrl, emptyConfig} from './backstop-const';
import {getScenarioList} from './backstop-helper';

(async () => {
    backstop('approve', {
        config: {
            ...emptyConfig,
            scenarios: await getScenarioList(baseUrl),
        },
    });
})();
