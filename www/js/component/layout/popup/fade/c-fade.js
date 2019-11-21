// @flow

import React, {Component, type Node} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import type {PopupPropsType} from '../type';

import fadeStyle from './fade.scss';

const fadeTimeOut = 300;

const fadeClassNames = {
    enter: fadeStyle.fade__enter,
    enterActive: fadeStyle.fade__enter__active,
    exit: fadeStyle.fade__exit,
};

export class Fade extends Component<PopupPropsType, null> {
    renderContent(): Node {
        const {props} = this;
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
        return <TransitionGroup>{this.renderContent()}</TransitionGroup>;
    }
}
