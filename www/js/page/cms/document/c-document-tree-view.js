// @flow

import React, {Component, type Node} from 'react';
import Paper from '@material-ui/core/Paper';

import mainWrapperStyle from '../../../component/main-wrapper/main-wrapper.scss';
import {DocumentTree} from '../../../component/layout/document-tree/c-document-tree';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';

type PropsType = {
    +userContextData: UserContextConsumerType,
};
type StateType = {};

export class DocumentTreeView extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {};
    }

    render(): Node {
        const {props} = this;
        const {userContextData} = props;

        /*
        if (!getIsAdmin(userContextData)) {
            return null;
        }
*/

        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <DocumentTree/>
            </Paper>
        );
    }
}
