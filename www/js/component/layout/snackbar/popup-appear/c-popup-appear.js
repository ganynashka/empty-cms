// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import className from 'classnames';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import type {SnackbarPropsType} from '../type';
import {ScreenContextConsumer} from '../../../screen/c-screen-context';
import type {ScreenContextType} from '../../../screen/screen-helper';

import popupAppearStyle from './popup-appear.style.scss';

const popupAppearTimeOut = 300;

const popupAppearClassNames = {
    enter: popupAppearStyle.popup_appear__enter,
    enterActive: popupAppearStyle.popup_appear__enter__active,
    enterDone: popupAppearStyle.popup_appear__enter__done,
    exit: popupAppearStyle.popup_appear__exit,
};

export class PopupAppear extends Component<SnackbarPropsType> {
    renderContent(): Node {
        const view = this;
        const {props} = view;
        const {isShow, isFullScreen, children, onEnter, onEntering, onEntered, onExit, onExiting, onExited} = props;

        if (!isShow) {
            return null;
        }

        return (
            <CSSTransition
                classNames={popupAppearClassNames}
                key="css-transition--snackbar-appear"
                onEnter={onEnter}
                onEntered={onEntered}
                onEntering={onEntering}
                onExit={onExit}
                onExited={onExited}
                onExiting={onExiting}
                timeout={popupAppearTimeOut}
            >
                <ScreenContextConsumer>
                    {(screenContextData: ScreenContextType): Node => {
                        if (isFullScreen === true) {
                            return (
                                <div className={popupAppearStyle.popup_wrapper}>
                                    <div
                                        className={className(
                                            popupAppearStyle.popup_container,
                                            popupAppearStyle.popup_container__full_screen
                                        )}
                                    >
                                        {children}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div className={popupAppearStyle.popup_wrapper}>
                                <div
                                    className={popupAppearStyle.popup_container}
                                    style={{
                                        maxWidth: Math.round(screenContextData.width * 0.9),
                                        maxHeight: Math.round(screenContextData.height * 0.9),
                                    }}
                                >
                                    {children}
                                </div>
                            </div>
                        );
                    }}
                </ScreenContextConsumer>
            </CSSTransition>
        );
    }

    render(): Node {
        const view = this;

        return <TransitionGroup>{view.renderContent()}</TransitionGroup>;
    }
}
