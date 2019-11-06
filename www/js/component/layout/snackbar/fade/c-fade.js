// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import type {SnackbarPropsType} from '../type';

import fadeStyle from './fade.style.scss';

const fadeTimeOut = 300;

const fadeClassNames = {
    enter: fadeStyle.fade__enter,
    enterActive: fadeStyle.fade__enter__active,
    exit: fadeStyle.fade__exit,
};

export class Fade extends Component<SnackbarPropsType, null> {
    renderContent(): Node {
        const view = this;
        const {props} = view;
        const {isShow, children, onEnter, onEntering, onEntered, onExit, onExiting, onExited} = props;

        if (!isShow) {
            return null;
        }

        return (
            <CSSTransition
                classNames={fadeClassNames}
                key="css-transition--fade"
                onEnter={onEnter}
                onEntered={onEntered}
                onEntering={onEntering}
                onExit={onExit}
                onExited={onExited}
                onExiting={onExiting}
                timeout={fadeTimeOut}
            >
                {children}
            </CSSTransition>
        );
    }

    render(): Node {
        const view = this;

        return <TransitionGroup>{view.renderContent()}</TransitionGroup>;
    }
}
