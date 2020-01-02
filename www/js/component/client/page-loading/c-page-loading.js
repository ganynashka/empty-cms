// @flow

import React, {Component, type Node} from 'react';

import pageLoadingStyle from './page-loading.scss';
import loadingImage from './image/favicon.svg';

type PropsType = {};

export function PageLoading(props: PropsType): Node {
    return (
        <div className={pageLoadingStyle.page_loading__wrapper}>
            <img alt="" className={pageLoadingStyle.page_loading__image} src={loadingImage}/>
            <h4 className={pageLoadingStyle.page_loading__text}>Загрузка&hellip;</h4>
        </div>
    );
}
