// @flow

import React, {Component, type Node} from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import documentTreeStyle from './document-tree.style.scss';
import {DocumentTreeItem} from './c-docuemnt-tree-item';

type PropsType = {};
type StateType = {};

export class DocumentTree extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {};
    }

    render(): Node {
        return (
            <div className={documentTreeStyle.tree_view__wrapper}>
                <TreeView defaultCollapseIcon={<ExpandMoreIcon/>} defaultExpandIcon={<ChevronRightIcon/>}>
                    <DocumentTreeItem deep={10} slug="root"/>
                </TreeView>
            </div>
        );
    }
}
