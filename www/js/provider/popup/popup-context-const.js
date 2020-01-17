// @flow

import type {PopupContextType, PopupPropsType} from './popup-context-type';

export const defaultPopupContextData: PopupContextType = {
    showPopup: (popupProps: PopupPropsType, id: string): Promise<mixed> => Promise.resolve(null),
    hidePopupById(id: string, value: mixed): null {
        return null;
    },
};
