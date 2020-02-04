// @flow

import backstop from 'backstopjs';

import {emptyConfig} from './backstop-const';
import {getScenarioList} from './backstop-helper';

const baseUrl = 'http://localhost:9090';

(async () => {
    backstop('test', {
        config: {
            ...emptyConfig,
            scenarios: await getScenarioList(baseUrl),
        },
    });
})();
