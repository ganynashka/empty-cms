// @flow

/* global document */

import type {Node} from 'react';
import React from 'react';
import ReactDOM from 'react-dom';

import type {PopupPropsType} from './fade/c-fade';
import {Fade} from './fade/c-fade';
import {PopupAppear} from './popup-appear/c-popup-appear';
import fadeStyle from './fade/fade.style.scss';

export function Popup({
    children,
    isShow,
    isFullScreen,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
}: PopupPropsType): Node {
    if (typeof document === 'undefined') {
        return null;
    }

    const {body} = document;

    if (body === null) {
        throw new Error('Body is not define');
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
        body
    );
}
