// @flow

import pageWrapperStyle from '../../page-wrapper/page-wrapper.scss';

export const routeCssTransitionClassNameMap = {
    enter: pageWrapperStyle.transition_enter,
    enterActive: pageWrapperStyle.transition_enter_active,
    exit: pageWrapperStyle.transition_exit,
    exitActive: pageWrapperStyle.transition_exit_active,
};
