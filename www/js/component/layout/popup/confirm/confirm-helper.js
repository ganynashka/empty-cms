// @flow

// import type {Node} from 'react';
// import React, {Component} from 'react';

// import type {PassedPopupHeaderPropsType} from '../popup-header/c-popup-header';
import type {HidePopupByIdType} from '../popup-portal/c-popup-portal';
// import {PopupHeader} from '../popup-header/c-popup-header';
// import {PopupContent} from '../popup-content/c-popup-content';
// import type {PassedPopupContentPropsType} from '../popup-content/c-popup-content';

export function createHandler(
    handler: HidePopupByIdType,
    confirmId: string,
    value: mixed
): (evt: SyntheticEvent<HTMLButtonElement>) => mixed {
    return (evt: SyntheticEvent<HTMLButtonElement>): mixed => handler(confirmId, value);
}

/*

export function renderHeader(
    headerForRender: PassedPopupHeaderPropsType,
    handler: HidePopupByIdType,
    confirmId: string
): Node {
    const {children, closeButton} = headerForRender;

    if (closeButton) {
        return (
            <PopupHeader
                closeButton={{
                    ...closeButton,
                    onClick: () => {
                        handler(confirmId, null);
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

export function renderContent(content: PassedPopupContentPropsType): Node {
    const {children} = content;

    return <PopupContent>{children}</PopupContent>;
}
*/
