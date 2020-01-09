// @flow

/* global document */

import React, {Component, type Node} from 'react';

import {handleApplyGdpr, isGdprApplyed} from '../../../lib/cookie';

import gdprInfoStyle from './gdpr-info.scss';

type PropsType = {};
type StateType = {|
    +isVisible: boolean,
|};

export class GdprInfo extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            isVisible: this.getDefaultIsVisible(),
        };
    }

    getDefaultIsVisible(): boolean {
        if (typeof document === 'undefined') {
            return false;
        }

        return !isGdprApplyed();
    }

    handleApplyGdpr = () => {
        handleApplyGdpr();
        this.setState({isVisible: false});
    };

    render(): Node {
        const {state} = this;
        const {isVisible} = state;

        if (!isVisible) {
            return null;
        }

        return (
            <div className={gdprInfoStyle.gdpr_info__wrapper}>
                <div className={gdprInfoStyle.gdpr_info__container}>
                    <p className={gdprInfoStyle.gdpr_info__text}>
                        Пользуясь настоящим веб-сайтом, вы даёте свое согласие на использование файлов cookies.
                    </p>
                    <button className={gdprInfoStyle.gdpr_info__button} onClick={this.handleApplyGdpr} type="button"/>
                </div>
            </div>
        );
    }
}
