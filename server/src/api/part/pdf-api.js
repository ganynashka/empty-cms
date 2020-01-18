// @flow

import {type $Application, type $Request, type $Response} from 'express';
import htmlPdf from 'html-pdf';

import {pdfApiRouteMap} from '../api-route-map';
import {isError} from '../../../../www/js/lib/is';
import {hostingDomainName} from '../../config';

import {imageSrcToHtml} from './pdf-api-helper';

export function addPdfApi(app: $Application) {
    app.get(pdfApiRouteMap.getImageAsPdf, async (request: $Request, response: $Response) => {
        const {query} = request;

        const src = decodeURIComponent(String(query.src || '').trim());

        if (!src) {
            response.status(404);
            response.json({isSuccessful: false, errorList: ['Can not find image']});
            return;
        }

        const config = {
            format: 'A4',
            orientation: 'portrait',
            border: '0.2in',
            type: 'pdf',
            quality: '100',
        };

        htmlPdf
            .create(imageSrcToHtml(src, hostingDomainName), config)
            // eslint-disable-next-line id-match
            .toStream((error: Error | null, stream: stream$Readable | null) => {
                if (isError(error) || !stream) {
                    response.status(400);
                    response.send('Error: can not make PDF!');
                    return;
                }
                stream.pipe(response);
            });
    });
}
