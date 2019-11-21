// @flow

import React, {Component, type Node} from 'react';

import type {PopupContextType, PopupPropsType} from '../popup-context-type';
import {PopupContextConsumer} from '../c-popup-context';
import type {PassedPopupHeaderPropsType} from '../popup-header/c-popup-header';
import {PopupHeader} from '../popup-header/c-popup-header';
import type {PassedPopupContentPropsType} from '../popup-content/c-popup-content';
import {PopupContent} from '../popup-content/c-popup-content';
import {FormButton} from '../../../component/layout/form-button/c-form-button';
import {Locale} from '../../locale/c-locale';
import {ButtonListWrapper} from '../../../component/layout/button-list-wrapper/c-button-list-wrapper';

import {createHandler} from './confirm-helper';
import confirmStyle from './confirm.scss';

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

    renderHeader(popupContextData: PopupContextType): Node {
        const {props} = this;
        const {id, header} = props;
        const {hidePopupById} = popupContextData;
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
        const {props} = this;
        const {content} = props;
        const {children} = content;

        return <PopupContent>{children}</PopupContent>;
    }

    renderButtonList(popupContextData: PopupContextType): Node {
        const {props} = this;
        const {id} = props;
        const {hidePopupById} = popupContextData;

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
        return (
            <PopupContextConsumer>
                {(popupContextData: PopupContextType): Node => {
                    return (
                        <>
                            {this.renderHeader(popupContextData)}
                            {this.renderContent()}
                            {this.renderButtonList(popupContextData)}
                        </>
                    );
                }}
            </PopupContextConsumer>
        );
    }
}
