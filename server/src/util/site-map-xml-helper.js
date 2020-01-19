// @flow

/* global process */

import path from 'path';
import fileSystem from 'fs';

import type {MongoDocumentType} from '../database/database-type';
import {rootDocumentSlug} from '../api/part/document-api-const';
import {hostingDomainName} from '../config';
import {getLinkToReadArticle} from '../../../www/js/lib/string';
import {isError} from '../../../www/js/lib/is';
import {pathToDist} from '../../../webpack/config';
import type {PromiseResolveType} from '../../../www/js/lib/promise';
import {mongoDocumentTypeMap} from '../database/database-type';

import {timeToHumanString} from './time';
import {getAllDocumentList} from './document-helper';

const CWD = process.cwd();

function getLocTagContent(mongoDocument: MongoDocumentType): string {
    const {slug} = mongoDocument;

    if (slug === rootDocumentSlug) {
        return 'https://' + hostingDomainName + '/';
    }

    return 'https://' + hostingDomainName + getLinkToReadArticle(slug);
}

function getLastmodTagContent(mongoDocument: MongoDocumentType): string {
    const {updatedDate} = mongoDocument;
    const [yyyymmdd, hhmmss] = timeToHumanString(updatedDate).split(' ');

    return yyyymmdd;
}

function getChangefreqTagContent(mongoDocument: MongoDocumentType): string {
    return 'weekly'; // always, hourly, daily, weekly, monthly, yearly, never
}

function getPriorityTagContent(mongoDocument: MongoDocumentType): string {
    const {slug, type} = mongoDocument;

    if (slug === rootDocumentSlug) {
        return '1.0';
    }

    if (type === mongoDocumentTypeMap.container) {
        return '0.8';
    }

    // article and downloadable-image-list
    return '0.5';
}

function mongoDocumentToSiteMapXml(mongoDocument: MongoDocumentType): string {
    return [
        '    <url>',
        `        <loc>${getLocTagContent(mongoDocument)}</loc>`,
        `        <lastmod>${getLastmodTagContent(mongoDocument)}</lastmod>`,
        `        <changefreq>${getChangefreqTagContent(mongoDocument)}</changefreq>`,
        `        <priority>${getPriorityTagContent(mongoDocument)}</priority>`,
        '    </url>',
    ].join('\n');
}

async function getSiteMapXml(): Promise<string | Error> {
    const documentList = await getAllDocumentList();

    if (isError(documentList)) {
        return documentList;
    }

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?xml-stylesheet type="text/xsl" href="/gss-0.9.xsl"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        documentList
            .filter((documentInList: MongoDocumentType): boolean => documentInList.isActive)
            .map(mongoDocumentToSiteMapXml)
            .join('\n'),
        '</urlset>',
    ].join('\n');
}

export async function updateSiteMapXml(): Promise<null | Error> {
    const siteMapXmlString = await getSiteMapXml();

    if (isError(siteMapXmlString)) {
        return siteMapXmlString;
    }

    return new Promise((resolve: PromiseResolveType<null | Error>) => {
        const pathToFile = path.join(CWD, pathToDist, 'sitemap.xml');

        fileSystem.writeFile(pathToFile, siteMapXmlString, (error: Error | mixed) => {
            if (isError(error)) {
                resolve(error);
                return;
            }

            resolve(null);
        });
    });
}
