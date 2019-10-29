// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';

import type {PopupPortalContextType} from '../popup-portal/c-popup-portal';
import {PopupPortalContextConsumer} from '../popup-portal/c-popup-portal';
import type {PassedPopupHeaderPropsType} from '../popup-header/c-popup-header';
import {PopupHeader} from '../popup-header/c-popup-header';
import type {PassedPopupContentPropsType} from '../popup-content/c-popup-content';
import {PopupContent} from '../popup-content/c-popup-content';
import {FormButton} from '../../form-button/c-form-button';
import {Locale} from '../../../locale/c-locale';
import {ButtonListWrapper} from '../../button-list-wrapper/c-button-list-wrapper';
import type {PopupPropsType} from '../fade/c-fade';

import {createHandler} from './confirm-helper';
import confirmStyle from './confirm.style.scss';

type PropsType = {|
    +header: PassedPopupHeaderPropsType,
    +content: PassedPopupContentPropsType,
    +id: string,
|};

type StateType = null;

export class Confirm extends Component<PropsType, StateType> {
    static getConfirmPopup(confirmation: Node): [PopupPropsType, string] {
        const confirmId = 'confirmId-' + String(Math.random());
        const content = {children: confirmation};

        const header = {
            children: <Locale stringKey="POPUP__CONFIRM__HEADER__CONFIRMATION"/>,
        };

        const popupChildren = <Confirm content={content} header={header} id={confirmId}/>;

        return [{isShow: false, children: popupChildren}, confirmId];
    }

    renderHeader(popupPortalContextData: PopupPortalContextType): Node {
        const view = this;
        const {props} = view;
        const {id, header} = props;
        const {hidePopupById} = popupPortalContextData;
        const {children, closeButton} = header;

        if (closeButton) {
            return (
                <PopupHeader
                    closeButton={{
                        ...closeButton,
                        onClick: () => {
                            hidePopupById(id, null);
                            closeButton.onClick();
                        },
                    }}
                >
                    {children}
                </PopupHeader>
            );
        }

        return <PopupHeader>{children}</PopupHeader>;
    }

    renderContent(): Node {
        const view = this;
        const {props} = view;
        const {content} = props;
        const {children} = content;

        return <PopupContent>{children}</PopupContent>;
    }

    renderButtonList(popupPortalContextData: PopupPortalContextType): Node {
        const view = this;
        const {props} = view;
        const {id} = props;
        const {hidePopupById} = popupPortalContextData;

        return (
            <ButtonListWrapper className={confirmStyle.confirm__button_list_wrapper} direction="right">
                <FormButton className={confirmStyle.confirm__button} onClick={createHandler(hidePopupById, id, false)}>
                    <Locale stringKey="POPUP__CONFIRM__BUTTON__CANCEL"/>
                </FormButton>
                <FormButton
                    className={confirmStyle.confirm__button}
                    isDefault
                    onClick={createHandler(hidePopupById, id, true)}
                >
                    <Locale stringKey="POPUP__CONFIRM__BUTTON__OK"/>
                </FormButton>
            </ButtonListWrapper>
        );
    }

    render(): Node {
        const view = this;

        return (
            <PopupPortalContextConsumer>
                {(popupPortalContextData: PopupPortalContextType): Node => {
                    return (
                        <>
                            {view.renderHeader(popupPortalContextData)}
                            {view.renderContent()}
                            {view.renderButtonList(popupPortalContextData)}
                        </>
                    );
                }}
            </PopupPortalContextConsumer>
        );
    }
}
