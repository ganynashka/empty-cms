// @flow

import React, {Component, type Node} from 'react';

import loadingImage from '../header/image/favicon.svg';
import {scrollToTop} from '../../../provider/screen/screen-context-helper';

import pageLoadingStyle from './page-loading.scss';

type StateType = null;
type PropsType = {};

export class PageLoading extends Component<PropsType, StateType> {
    componentDidMount() {
        scrollToTop();
    }

    render(): Node {
        return (
            <div className={pageLoadingStyle.page_loading__wrapper}>
                <img alt="" className={pageLoadingStyle.page_loading__image} src={loadingImage}/>
                <h4 className={pageLoadingStyle.page_loading__text}>Загрузка&hellip;</h4>
            </div>
        );
    }
}
