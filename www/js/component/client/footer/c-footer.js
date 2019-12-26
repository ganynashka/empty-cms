// @flow

import React, {type Node} from 'react';
import {Link} from 'react-router-dom';

import type {LocationType} from '../../../type/react-router-dom-v5-type-extract';
import {isCMS} from '../../../lib/url';

import footerStyle from './footer.scss';

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
    const copyRight = `© Сказки детям 2019-${year}`;

    return (
        <footer className={footerStyle.footer_wrapper}>
            <p>{copyRight}</p>
            <Link className={footerStyle.footer__link} to="#">
                Правообладателям
            </Link>
            <Link className={footerStyle.footer__link} to="#">
                Обратная связь
            </Link>
            <Link className={footerStyle.footer__link} to="#">
                Политика конфиденциальности
            </Link>
        </footer>
    );
}
