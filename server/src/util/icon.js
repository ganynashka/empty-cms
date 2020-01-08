// @flow

function generateIconList1(): string {
    const sizeList = [57, 60, 72, 76, 114, 120, 144, 152, 180];
    const template
        // eslint-disable-next-line max-len
        = '<link rel="apple-touch-icon" sizes="{size}x{size}" href="/api/get-resized-image/favicon.png?width={size}&height={size}&fit=inside&kernel=nearest&without-enlargement=0"/>';

    return sizeList.map((size: number): string => template.replace(/{size}/g, String(size))).join('\n');
}

function generateIconList2(): string {
    const sizeList = [16, 32, 96, 192];
    const template
        // eslint-disable-next-line max-len
        = '<link rel="icon" type="image/png" sizes="{size}x{size}" href="/api/get-resized-image/favicon.png?width={size}&height={size}&fit=inside&kernel=nearest&without-enlargement=0"/>';

    return sizeList.map((size: number): string => template.replace(/{size}/g, String(size))).join('\n');
}

export function generateIconList(): string {
    return [generateIconList1(), generateIconList2()].join('\n');
}
