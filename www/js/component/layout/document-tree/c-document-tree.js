// @flow

import React, {Component, type Node} from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';

import {getDocumentOrphanList} from '../../../page/cms/document/document-api';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {rootDocumentId} from '../../../../../server/src/api/part/document-api-const';
import {isError} from '../../../lib/is';

import documentTreeStyle from './document-tree.scss';
import {DocumentTreeItem} from './c-docuemnt-tree-item';

type PropsType = {};
type StateType = {|
    +documentOrphanList: Array<MongoDocumentType>,
|};

export class DocumentTree extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            documentOrphanList: [],
        };
    }

    async componentDidMount() {
        this.fetchDocumentOrphan();
    }

    async fetchDocumentOrphan() {
        const documentOrphanList = await getDocumentOrphanList();

        if (isError(documentOrphanList)) {
            console.error(documentOrphanList.message);
            return;
        }

        this.setState({documentOrphanList});
    }

    render(): Node {
        const {state} = this;
        const {documentOrphanList} = state;

        return (
            <div className={documentTreeStyle.tree_view__wrapper}>
                <Typography variant="h5">Documents tree:</Typography>
                <hr/>
                <TreeView defaultCollapseIcon={<ExpandMoreIcon/>} defaultExpandIcon={<ChevronRightIcon/>}>
                    <DocumentTreeItem deep={10} id={rootDocumentId}/>
                </TreeView>
                <hr/>
                <Typography variant="h5">Orphan documents:</Typography>
                <hr/>
                <TreeView defaultCollapseIcon={<ExpandMoreIcon/>} defaultExpandIcon={<ChevronRightIcon/>}>
                    {documentOrphanList.map((orphan: MongoDocumentType): Node => {
                        const {id} = orphan;

                        return <DocumentTreeItem deep={10} id={id} key={id}/>;
                    })}
                </TreeView>
            </div>
        );
    }
}
