// @flow

/* global document */

import React, {Component, type Node} from 'react';

import {handleApplyGdpr, isGdprApplyed} from '../../../lib/cookie';

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
            <div>
                <span>some text</span>
                <br/>
                <button onClick={this.handleApplyGdpr} type="button">
                    apply cookie
                </button>
            </div>
        );
    }
}
