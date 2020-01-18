// @flow

import {type $Application, type $Request, type $Response} from 'express';
import pdf from 'html-pdf';

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
            // height: '11.7in',        // allowed units: mm, cm, in, px
            // width: '8.3in',
            format: 'A4', // allowed units: A3, A4, A5, Legal, Letter, Tabloid
            orientation: 'portrait', // portrait or landscape
            border: '0.2in', // default is 0, units: mm, cm, in, px
            // header: {
            //     height: '15mm',
            //     contents: '<h1 class="image-pdf--page-header">page-header page-header page-header</h1>',
            // },
            /*
            footer: {
                height: '1mm',
                contents: {
                    'default': 'Страница: <span>{{page}}</span> / <span>{{pages}}</span>', // fallback value
                },
            },
            */
            type: 'pdf', // allowed file types: png, jpeg, pdf
            quality: '100', // only used for types png & jpeg
        };

        pdf.create(imageSrcToHtml(src, hostingDomainName), config).toStream(
            (error: Error | null, stream: stream$Writable) => {
                if (isError(error)) {
                    response.status(400);
                    response.send('Error: can not make PDF!');
                    return;
                }
                stream.pipe(response);
            }
        );
    });
}
