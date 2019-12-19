// @flow

import {type $Request, type $Response} from 'express';
import {type MongoCollection} from 'mongodb';

import type {MongoDocumentType} from '../../../../server/src/database/database-type';
import {getCollection} from '../../../../server/src/database/database-helper';
import {dataBaseConst} from '../../../../server/src/database/database-const';
import {isError} from '../../lib/is';
import {routePathMap} from '../../component/app/routes-path-map';
import {rootDocumentSlug, rootDocumentTreeDefaultDeep} from '../../../../server/src/api/part/document-api-const';
import {getDocumentTree} from '../../../../server/src/api/part/document-api-helper';

import {defaultInitialData, page404InitialData, rootPathMetaData} from './intial-data-const';
import type {InitialDataType} from './intial-data-type';

function getArticleData(
    collection: MongoCollection<MongoDocumentType>,
    path: string
): Promise<MongoDocumentType | null> {
    const slug = path.replace(routePathMap.article.staticPartPath + '/', '');

    return collection
        .findOne({slug})
        .then((mayBeDocument: MongoDocumentType | null): MongoDocumentType | null => {
            return mayBeDocument && mayBeDocument.isActive ? mayBeDocument : null;
        })
        .catch((error: Error): null => {
            console.log(`Can not find document with slug: ${slug}`);
            return null;
        });
}

// eslint-disable-next-line complexity, max-statements
export async function getInitialDataByPath(path: string): Promise<InitialDataType> {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);
    const mayBeDocumentNodeTree = await getDocumentTree(rootDocumentSlug, rootDocumentTreeDefaultDeep);
    const documentNodeTree = isError(mayBeDocumentNodeTree) ? null : mayBeDocumentNodeTree;

    if (isError(collection)) {
        return {...page404InitialData, documentNodeTree};
    }

    // root
    if (path === routePathMap.siteEnter.path) {
        const rootDocument = await collection.findOne({slug: rootDocumentSlug});

        if (rootDocument) {
            return {
                ...defaultInitialData,
                title: rootDocument.title,
                // description: rootDocument.description,
                documentNodeTree,
            };
        }

        console.error('Can not get root document');

        return {
            ...defaultInitialData,
            ...rootPathMetaData,
            documentNodeTree,
        };
    }

    // article
    if (path.startsWith(routePathMap.article.staticPartPath)) {
        const articlePathData = await getArticleData(collection, path);

        if (articlePathData) {
            return {
                ...defaultInitialData,
                title: articlePathData.title,
                // description: articlePathData.description,
                articlePathData,
                documentNodeTree,
            };
        }

        console.error('Can not get article');

        return {...page404InitialData, documentNodeTree};
    }

    // check cms
    if (path.startsWith(routePathMap.cmsEnter.path)) {
        return {...defaultInitialData, documentNodeTree};
    }

    return {...page404InitialData, documentNodeTree};
}

export async function getInitialData(request: $Request, response: $Response): Promise<InitialDataType> {
    if (String(response.statusCode) === '404') {
        return {...page404InitialData};
    }

    const {path} = request;

    return getInitialDataByPath(path);
}
