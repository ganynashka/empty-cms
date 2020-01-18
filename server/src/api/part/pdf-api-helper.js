// @flow

import {
    pdfApiImageToPdfHeaderImageSrc,
    pdfApiImageToPdfReplaceImageSrc,
    pdfApiImageToPdfTemplate,
} from './pdf-api-const';

export function imageSrcToHtml(imageSrc: string, header: string): string {
    return pdfApiImageToPdfTemplate
        .replace(pdfApiImageToPdfReplaceImageSrc, imageSrc)
        .replace(pdfApiImageToPdfHeaderImageSrc, header);
}
