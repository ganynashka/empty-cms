// @flow

import React, {type Node} from 'react';
import {Link} from 'react-router-dom';

import footerStyle from './footer.scss';

export function Footer(): Node {
    return (
        <footer className={footerStyle.footer_wrapper}>
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
