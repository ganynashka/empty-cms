// @flow

import {hostingDomainName} from '../config';

export function getSeoMetaString(url: string): string {
    return `<link rel="canonical" href="https://${hostingDomainName}${url}"/>`;
}
