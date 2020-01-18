// @flow

import React, {Component, type Node} from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

// eslint-disable-next-line max-len
import {FilePreview} from '../../../component/layout/form-generator/field/input-upload-file/file-preview/c-file-preview';
import mainWrapperStyle from '../../../component/main-wrapper/main-wrapper.scss';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';

import {getFileList} from './file-api';
import fileStyle from './file.scss';

type PropsType = {
    +snackbarContext: SnackbarContextType,
    +userContextData: UserContextConsumerType,
};

type StateType = {|
    +fileList: Array<string>,
|};

export class FileList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            fileList: [],
        };
    }

    componentDidMount() {
        this.fetchFileList();
    }

    async fetchFileList() {
        const fileList = await getFileList();

        if (Array.isArray(fileList)) {
            this.setState({fileList});
            return;
        }

        console.error('Can not load file list');
        console.error(fileList);
    }

    renderFile = (src: string): Node => {
        return <FilePreview key={src} src={src}/>;
    };

    render(): Node {
        const {state} = this;
        const {fileList} = state;

        /*
        const {userContextData} = props;

        if (!getIsAdmin(userContextData)) {
            return null;
        }
*/

        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography variant="h5">File list</Typography>
                </Toolbar>
                <div className={fileStyle.file_list_wrapper}>{fileList.map(this.renderFile)}</div>
            </Paper>
        );
    }
}
