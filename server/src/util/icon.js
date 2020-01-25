// @flow

import {getResizedImageSrc} from '../../../www/js/lib/url';
import {defaultOpenGraphData} from '../../../www/js/provider/intial-data/intial-data-const';
import {sharpKernelResizeNameMap} from '../../../www/js/page/cms/file/file-api';

const iconsSizeList = [16, 32, 96, 192];
const iconsTemplate = '<link rel="icon" type="image/png" sizes="{sizes}" href="{href}"/>';

function generateIconLinkList(): string {
    return iconsSizeList
        .map((size: number): string => {
            const href = getResizedImageSrc({
                src: defaultOpenGraphData.image,
                width: size,
                height: size,
                hasEnlargement: true,
                kernel: sharpKernelResizeNameMap.nearest,
            });
            const sizes = `${size}x${size}`;

            return iconsTemplate.replace('{href}', href).replace('{sizes}', sizes);
        })
        .join('\n');
}

const appleTouchIconSizeList = [57, 60, 72, 76, 114, 120, 144, 152, 180];
const appleTouchIconTemplate = '<link rel="apple-touch-icon" sizes="{sizes}" href="{href}"/>';

function generateAppleTouchIconLinkList(): string {
    return appleTouchIconSizeList
        .map((size: number): string => {
            const href = getResizedImageSrc({
                src: defaultOpenGraphData.image,
                width: size,
                height: size,
                hasEnlargement: true,
                kernel: sharpKernelResizeNameMap.nearest,
            });
            const sizes = `${size}x${size}`;

            return appleTouchIconTemplate.replace('{href}', href).replace('{sizes}', sizes);
        })
        .join('\n');
}

export function generateIconList(): string {
    return [generateIconLinkList(), generateAppleTouchIconLinkList()].join('\n');
}
