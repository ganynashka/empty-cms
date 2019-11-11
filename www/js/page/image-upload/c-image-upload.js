// @flow

import React, {Component, type Node} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper';

import mainWrapperStyle from '../../component/main-wrapper/main-wrapper.style.scss';
import {fileApiRouteMap} from '../../../../server/src/api/route-map';
import {fileApiConst} from '../../../../server/src/api/file-const';

type PropsType = {};
type StateType = {};

export class ImageUpload extends Component<PropsType, StateType> {
    render(): Node {
        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography variant="h5">Upload image</Typography>
                </Toolbar>
                <form action={fileApiRouteMap.uploadImageList} encType="multipart/form-data" method="post">
                    <input multiple name={fileApiConst.fileListFormPropertyName} type="file"/>
                    <input type="submit"/>
                </form>
            </Paper>
        );
    }
}
