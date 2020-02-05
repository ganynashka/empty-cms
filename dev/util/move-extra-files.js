// @flow

import fileSystem from 'fs';
import path from 'path';

import request from 'request';

import type {PromiseResolveType} from '../../www/js/lib/promise';
import {fileApiRouteMap} from '../../server/src/api/api-route-map';
import {cwd} from '../../webpack/config';
import {fileApiConst} from '../../server/src/api/part/file-api-const';

const host = 'http://localhost:9091';

const pathToExtraFile = '/extra-files';

fileSystem.mkdir(path.join(cwd, pathToExtraFile), (): null => null);

async function getFileList(): Promise<Array<string>> {
    return new Promise((resolve: PromiseResolveType<Array<string>>) => {
        request(
            {
                uri: host + fileApiRouteMap.getFileListWithoutParent,
            },
            (error: ?Error, response: Response, body: ?string) => {
                console.log('body');
                console.log(body);
                console.log('error');
                console.log(error);

                if (body) {
                    resolve(JSON.parse(body));
                    return;
                }
                resolve([]);
            }
        );
    });
}

(async () => {
    const fileList = await getFileList();

    fileList.forEach((fileName: string) => {
        fileSystem.rename(
            path.join(cwd, fileApiConst.pathToUploadFiles, fileName),
            path.join(cwd, pathToExtraFile, fileName),
            console.log
        );
    });

    console.log(fileList);
})();
