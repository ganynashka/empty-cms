// @flow

/* global document */

import type {Node} from 'react';
import React from 'react';
import ReactDOM from 'react-dom';

import {selector} from '../../../const';

import type {SnackbarPropsType} from './type';
import {Fade} from './fade/c-fade';
import {PopupAppear} from './popup-appear/c-popup-appear';
import fadeStyle from './fade/fade.style.scss';

export function Snackbar({
    children,
    isShow,
    isFullScreen,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
}: SnackbarPropsType): Node {
    if (typeof document === 'undefined') {
        return null;
    }

    const appWrapper = document.querySelector(selector.appWrapper);

    if (!appWrapper) {
        throw new Error('appWrapper is not define');
    }

    return ReactDOM.createPortal(
        [
            <Fade
                isShow={isShow}
                key="fade"
                onEnter={onEnter}
                onEntered={onEntered}
                onEntering={onEntering}
                onExit={onExit}
                onExited={onExited}
                onExiting={onExiting}
            >
                <div className={fadeStyle.fade}/>
            </Fade>,
            <PopupAppear isFullScreen={isFullScreen} isShow={isShow} key="content">
                {children}
            </PopupAppear>,
        ],
        appWrapper
    );
}
