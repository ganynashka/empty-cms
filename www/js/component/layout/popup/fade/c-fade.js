// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import fadeStyle from './fade.style.scss';

const fadeTimeOut = 300;

const fadeClassNames = {
    enter: fadeStyle.fade__enter,
    enterActive: fadeStyle.fade__enter__active,
    exit: fadeStyle.fade__exit,
};

export type PopupPropsType = {|
    +isShow: boolean,
    +isFullScreen?: boolean,
    +children: Node,

    +onEnter?: () => void,
    +onEntering?: () => void,
    +onEntered?: () => void,
    +onExit?: () => void,
    +onExiting?: () => void,
    +onExited?: () => void,
|};

export class Fade extends Component<PopupPropsType, null> {
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
