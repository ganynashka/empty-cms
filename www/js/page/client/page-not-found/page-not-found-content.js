// @flow

import React, {type Node} from 'react';

import pageNotFoundImageSrc from './image/404.png';
import pageNotFoundStyle from './page-not-found.scss';

export function PageNotFoundContent(): Node {
    return (
        <>
            <img
                alt="404 - Page Not Found"
                className={pageNotFoundStyle.page_not_found__image}
                src={pageNotFoundImageSrc}
            />

            <p className={pageNotFoundStyle.page_not_found__text}>
                <a className={pageNotFoundStyle.page_not_found__text_link} href="/">
                    Перейти на главную
                </a>
            </p>
        </>
    );
}
