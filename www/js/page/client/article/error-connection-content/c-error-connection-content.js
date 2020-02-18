// @flow

import React, {Component, type Node} from 'react';

import type {LocationType} from '../../../../type/react-router-dom-v5-type-extract';
import type {ScreenContextType} from '../../../../provider/screen/screen-context-type';
import type {InitialDataType} from '../../../../provider/intial-data/intial-data-type';
import articleStyle from '../article.scss';
import {setMeta} from '../../../../lib/meta';
import {scrollToTop} from '../../../../lib/screen';

type PropsType = {};

type StateType = null;

const title = 'Ошибка соединения';

export class ErrorConnectionContent extends Component<PropsType, StateType> {
    componentDidMount() {
        setMeta({title});
        scrollToTop();
    }

    render(): Node {
        return (
            <>
                <h1 className={articleStyle.article__header}>{title}</h1>
                <p>Ошибка соединения. Проверьте наличие интернета и обновите страницу.</p>
            </>
        );
    }
}
