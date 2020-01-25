// @flow

import {pdfApiImageToPdfReplaceImageSrc, pdfApiImageToPdfTemplate} from './pdf-api-const';

export function imageSrcToHtml(imageSrc: string): string {
    return pdfApiImageToPdfTemplate.replace(pdfApiImageToPdfReplaceImageSrc, imageSrc);
}
