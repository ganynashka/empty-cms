// @flow

import React, {Component, type Node} from 'react';
import className from 'classnames';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import type {PopupPropsType} from '../popup-context-type';
import {ScreenContextConsumer} from '../../screen/c-screen-context';
import type {ScreenContextType} from '../../screen/screen-context-type';

import popupAppearStyle from './popup-appear.scss';
import {popupAppearClassNames} from './popup-appear-const';

const popupAppearTimeOut = 300;

export class PopupAppear extends Component<PopupPropsType> {
    renderContent(): Node {
        const {props} = this;
        const {isShow, isFullScreen, children, onEnter, onEntering, onEntered, onExit, onExiting, onExited} = props;

        if (!isShow) {
            return null;
        }

        return (
            <CSSTransition
                classNames={popupAppearClassNames}
                key="css-transition--popup-appear"
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
        return <TransitionGroup>{this.renderContent()}</TransitionGroup>;
    }
}
