// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {isError} from '../../../../www/js/lib/is';

import {getAllDocumentList, mongoDocumentToSiteMapXml} from './site-map-xml-api-helper';

export function siteMapXmlApi(app: $Application) {
    app.get('/sitemap.xml', async (request: $Request, response: $Response) => {
        const documentList = await getAllDocumentList();

        if (isError(documentList)) {
            response.status(404);
            response.send('404 - Not found');
            return;
        }

        const lineFirst = '<?xml version="1.0" encoding="utf-8"?>\n';
        const lineSecond = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        const lineLast = '</urlset>\n';

        response.set('Content-Type', 'application/xml');

        const xmlDataList = documentList.map(mongoDocumentToSiteMapXml);

        response.send(lineFirst + lineSecond + xmlDataList.join('\n') + lineLast);
    });
}
