// @flow

/* global navigator */

import React, {Component, type Node} from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

import mainWrapperStyle from '../../component/main-wrapper/main-wrapper.style.scss';
import serviceStyle from '../../../css/service.scss';
import type {SnackbarPortalContextType} from '../../component/layout/snackbar/snackbar-portal/c-snackbar-portal';
import {promiseCatch} from '../../lib/promise';
import {isError} from '../../lib/is';

import {getImageList, getResizedImage} from './image-api';
import imageStyle from './image.scss';

type PropsType = {
    +snackbarPortalContext: SnackbarPortalContextType,
};

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

    handleCopyImageSrc = async (evt: SyntheticEvent<HTMLElement>) => {
        const {props} = this;
        const {snackbarPortalContext} = props;
        const snackBarId = 'copy-image-markdown-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarPortalContext;

        if (!navigator.clipboard) {
            await showSnackbar(
                {children: 'Your browser DO NOT support \'navigator.clipboard\'!', variant: 'error'},
                snackBarId
            );
            return;
        }

        const src = String(evt.currentTarget.dataset.src);

        const imageMarkdown = `![](${getResizedImage(src, 1024, 1024)})`;

        const copyResult = await navigator.clipboard.writeText(imageMarkdown).catch(promiseCatch);

        if (isError(copyResult)) {
            await showSnackbar({children: 'can not copy image markdown!', variant: 'error'}, snackBarId);
            return;
        }

        await showSnackbar({children: 'Copy as markdown!', variant: 'success'}, snackBarId);
    };

    renderImage = (src: string): Node => {
        return (
            <button
                className={imageStyle.image_wrapper}
                data-src={src}
                key={src}
                onClick={this.handleCopyImageSrc}
                type="button"
            >
                <img alt="" className={imageStyle.image} src={getResizedImage(src, 256, 256)}/>
                <span className={imageStyle.image_name}>
                    <span className={serviceStyle.ellipsis}>{src.replace(/--md5__[\S\s]+/, '')}</span>
                </span>
            </button>
        );
    };

    render(): Node {
        const {state} = this;
        const {imageList} = state;

        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography variant="h5">Image list</Typography>
                </Toolbar>
                <div className={imageStyle.image_list_wrapper}>{imageList.map(this.renderImage)}</div>
            </Paper>
        );
    }
}
