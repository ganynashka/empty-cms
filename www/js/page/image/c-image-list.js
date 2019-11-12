// @flow

import React, {Component, type Node} from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

import mainWrapperStyle from '../../component/main-wrapper/main-wrapper.style.scss';

import {getImageList} from './image-api';

type PropsType = {};
type StateType = {|
    +imageList: Array<string>,
|};

export class ImageList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            imageList: [],
        };
    }

    componentDidMount() {
        this.fetchImageList();
    }

    async fetchImageList() {
        const imageList = await getImageList();

        if (Array.isArray(imageList)) {
            this.setState({imageList});
            return;
        }

        console.error('Can not load image list');
        console.error(imageList);
    }

    render(): Node {
        const {state} = this;
        const {imageList} = state;

        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography variant="h5">Image list</Typography>
                </Toolbar>
                <div>{JSON.stringify(imageList)}</div>
            </Paper>
        );
    }
}
