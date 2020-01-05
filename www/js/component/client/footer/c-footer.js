// @flow

import React, {type Node} from 'react';
import {Link} from 'react-router-dom';

import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';
import {getLinkToReadArticle} from '../../../lib/string';

import footerStyle from './footer.scss';
import {footerLinkMap} from './footer-const';

type PropsType = {
    +location?: LocationType,
};

export function Footer(props: PropsType): Node {
    const {location} = props;

    if (!location) {
        return null;
    }

    if (isCMS(location)) {
        return null;
    }

    const year = new Date().getFullYear();
    const copyRight = `© Сказки детям ${year}г.`;

    return (
        <footer className={footerStyle.footer_wrapper}>
            <p className={footerStyle.footer__copy_right}>{copyRight}</p>
            <Link
                className={footerStyle.footer__link}
                target="_blank"
                to={getLinkToReadArticle(footerLinkMap.holders.slug)}
            >
                {footerLinkMap.holders.title}
            </Link>
            <Link
                className={footerStyle.footer__link}
                target="_blank"
                to={getLinkToReadArticle(footerLinkMap.contacts.slug)}
            >
                {footerLinkMap.contacts.title}
            </Link>
            <Link
                className={footerStyle.footer__link}
                target="_blank"
                to={getLinkToReadArticle(footerLinkMap.policy.slug)}
            >
                {footerLinkMap.policy.title}
            </Link>
        </footer>
    );
}
