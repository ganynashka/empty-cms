// @flow

import path from 'path';
import fileSystem from 'fs';
import https from 'https';

import type {
    JsonToMongoDocumentItemType,
    JsonToMongoDocumentType,
    // eslint-disable-next-line max-len
} from '../../../www/js/component/layout/form-generator/field/input-upload-json-as-document/input-upload-json-as-document-type';
import type {MongoDocumentType} from '../database/database-type';
import {getSlug} from '../../../www/js/lib/string';
import {mongoDocumentTypeMap, mongoSubDocumentsViewTypeMap} from '../database/database-type';
import {cwd} from '../../../webpack/config';
import {fileApiConst} from '../api/part/file-api-const';
import {isError} from '../../../www/js/lib/is';
import {getMarkdownResizedImage} from '../../../www/js/page/cms/file/file-api';

import {getTime} from './time';

function getFileByUrl(url: string, destination: string): Promise<Error | string> {
    const file = fileSystem.createWriteStream(destination);

    return new Promise((resolve: (result: Error | string) => mixed) => {
        // eslint-disable-next-line id-match
        const request = https.get(url, (response: http$IncomingMessage<net$Socket>) => {
            // check if response is success
            if (Number(response.statusCode) !== 200) {
                resolve(new Error('Response status was ' + response.statusCode));
                return;
            }

            response.pipe(file);
        });

        file.on('finish', () => {
            file.close();
            resolve(destination);
        });

        request.on('error', (error: Error) => {
            fileSystem.unlink(destination);
            resolve(error);
        });

        file.on('error', (error: Error) => {
            fileSystem.unlink(destination);
            resolve(error);
        });
    });
}

async function makeData(rawData: JsonToMongoDocumentItemType, prefix: string): Promise<JsonToMongoDocumentItemType> {
    const text = rawData.text.trim();
    const src = rawData.src.trim();

    if (text) {
        return {
            src: '',
            text,
        };
    }

    if (src) {
        const fileName
            = prefix
            + '-'
            + rawData.src
                .trim()
                .split('/')
                .pop();
        const newSrc = await getFileByUrl(rawData.src.trim(), path.join(cwd, fileApiConst.pathToUploadFiles, fileName));

        if (isError(newSrc)) {
            throw new Error(newSrc.message);
        }

        return {
            src: newSrc.replace(cwd, '').replace(fileApiConst.pathToUploadFiles + '/', ''),
            text: '',
        };
    }

    throw new Error('Should be text or src.');
}

function dataToContent(rawData: JsonToMongoDocumentItemType): string {
    const text = rawData.text.trim();
    const src = rawData.src.trim();

    if (text) {
        return text;
    }

    if (src) {
        return getMarkdownResizedImage(src);
    }

    throw new Error('Should be text or src.');
}

export async function convertJsonToDocument(jsonDocument: JsonToMongoDocumentType): Promise<MongoDocumentType> {
    const date = getTime();
    const slug = getSlug(jsonDocument.header);

    const newDocument: MongoDocumentType = {
        id: slug + '-' + Math.random() + '-' + date,
        slug,
        titleImage: '',
        type: mongoDocumentTypeMap.article,
        subDocumentListViewType: mongoSubDocumentsViewTypeMap.auto,
        title: jsonDocument.header,
        header: jsonDocument.header,
        author: jsonDocument.author,
        illustrator: jsonDocument.illustrator,
        artist: jsonDocument.artist,
        publicationDate: 0,
        meta: '',
        shortDescription: '',
        content: '',
        createdDate: date,
        updatedDate: date,
        subDocumentSlugList: [],
        subDocumentIdList: [],
        tagList: [],
        rating: 0,
        isActive: true,
        isInSiteMap: true,
        fileList: [],
    };

    const newList = await Promise.all(
        jsonDocument.itemList.map(
            (jsonDocumentItem: JsonToMongoDocumentItemType, index: number): Promise<JsonToMongoDocumentItemType> => {
                return makeData(jsonDocumentItem, slug);
            }
        )
    );

    const fileList = newList
        .map((jsonDocumentItem: JsonToMongoDocumentItemType): string => jsonDocumentItem.src.trim())
        .filter(Boolean)
        .map((src: string): string => src.split('/').pop());

    return Promise.resolve({
        ...newDocument,
        content: newList.map(dataToContent).join('\n'),
        fileList,
    });
}
