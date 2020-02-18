// @flow

import {getLinkToReadArticle} from '../../../lib/string';

export const footerLinkMap = {
    holders: {
        slug: 'holders',
        title: 'Правообладателям',
    },
    policy: {
        slug: 'policy',
        title: 'Политика конфиденциальности',
    },
    contacts: {
        slug: 'contacts',
        title: 'Обратная связь',
    },
};

export const footerLinkList = Object.keys(footerLinkMap).map<string>((key: string): string => {
    return getLinkToReadArticle(footerLinkMap[key].slug);
});
