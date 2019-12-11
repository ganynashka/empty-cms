// @flow

/* global navigator */

/* eslint-disable jsx-a11y/media-has-caption */

import React, {Component, type Node} from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import mime from 'mime-types';

import mainWrapperStyle from '../../../component/main-wrapper/main-wrapper.scss';
import serviceStyle from '../../../../css/service.scss';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import {promiseCatch} from '../../../lib/promise';
import {isError, isString} from '../../../lib/is';
import {getNoHashFileName} from '../../../lib/string';
import {isAdmin} from '../../../provider/user/user-context-helper';
import {fileApiConst} from '../../../../../server/src/api/part/file-api-const';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';

import {getFileList, getMarkdownResizedImage, getResizedImage} from './file-api';
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

    handleCopyImageSrc = async (evt: SyntheticEvent<HTMLElement>) => {
        const {props} = this;
        const {snackbarContext} = props;
        const snackBarId = 'copy-image-markdown-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarContext;

        if (!navigator.clipboard) {
            await showSnackbar(
                {children: 'Your browser DO NOT support \'navigator.clipboard\'!', variant: 'error'},
                snackBarId
            );
            return;
        }

        const src = String(evt.currentTarget.dataset.src);

        const imageMarkdown = getMarkdownResizedImage(src);

        const copyResult = await navigator.clipboard.writeText(imageMarkdown).catch(promiseCatch);

        if (isError(copyResult)) {
            await showSnackbar({children: 'Can not copy image markdown!', variant: 'error'}, snackBarId);
            return;
        }

        await showSnackbar({children: 'Copy as markdown!', variant: 'success'}, snackBarId);
    };

    handleCopySrc = async (evt: SyntheticEvent<HTMLElement>) => {
        const {props} = this;
        const {snackbarContext} = props;
        const snackBarId = 'copy-file-src-snack-bar-id-' + String(Date.now());
        const {showSnackbar} = snackbarContext;

        if (!navigator.clipboard) {
            await showSnackbar(
                {children: 'Your browser DO NOT support \'navigator.clipboard\'!', variant: 'error'},
                snackBarId
            );
            return;
        }

        const src = fileApiConst.pathToUploadFiles + '/' + String(evt.currentTarget.dataset.src);

        const copyResult = await navigator.clipboard.writeText(src).catch(promiseCatch);

        if (isError(copyResult)) {
            await showSnackbar({children: 'Can not copy file src!', variant: 'error'}, snackBarId);
            return;
        }

        await showSnackbar({children: 'Copy as src!', variant: 'success'}, snackBarId);
    };

    renderFile = (src: string): Node => {
        const mimeType = String(mime.lookup(src) || 'N/A');

        if (mimeType.startsWith('image/')) {
            return this.renderImage(src);
        }

        if (mimeType.startsWith('audio/')) {
            return this.renderAudio(src);
        }

        if (mimeType.startsWith('video/')) {
            return this.renderVideo(src);
        }

        return this.renderDefaultFile(src);
    };

    renderImage = (src: string): Node => {
        return (
            <button
                className={fileStyle.file_wrapper}
                data-src={src}
                key={src}
                onClick={this.handleCopyImageSrc}
                type="button"
            >
                <img alt="" className={fileStyle.file} src={getResizedImage(src, 256, 256)}/>
                <span className={fileStyle.file_name}>
                    <span className={serviceStyle.ellipsis}>{getNoHashFileName(src)}</span>
                </span>
            </button>
        );
    };

    renderAudio = (src: string): Node => {
        return (
            <button
                className={fileStyle.file_wrapper}
                data-src={src}
                key={src}
                onClick={this.handleCopyImageSrc}
                type="button"
            >
                <audio
                    className={fileStyle.file__media_content}
                    controls
                    src={fileApiConst.pathToUploadFiles + '/' + src}
                />
                <span className={fileStyle.file_name}>
                    <span className={serviceStyle.ellipsis}>{getNoHashFileName(src)}</span>
                </span>
            </button>
        );
    };

    renderVideo = (src: string): Node => {
        return (
            <button
                className={fileStyle.file_wrapper}
                data-src={src}
                key={src}
                onClick={this.handleCopyImageSrc}
                type="button"
            >
                <video
                    className={fileStyle.file__media_content}
                    controls
                    src={fileApiConst.pathToUploadFiles + '/' + src}
                />
                <span className={fileStyle.file_name}>
                    <span className={serviceStyle.ellipsis}>{getNoHashFileName(src)}</span>
                </span>
            </button>
        );
    };

    renderDefaultFile(src: string): Node {
        const mimeType = String(mime.lookup(src) || 'N/A');

        return (
            <button
                className={fileStyle.file_wrapper}
                data-src={src}
                key={src}
                onClick={this.handleCopySrc}
                type="button"
            >
                <span className={fileStyle.file__mime_type}>{mimeType}</span>
                <span className={fileStyle.file_name}>
                    <span className={serviceStyle.ellipsis}>{getNoHashFileName(src)}</span>
                </span>
            </button>
        );
    }

    render(): Node {
        const {state} = this;
        const {fileList} = state;

        /*
        const {userContextData} = props;

        if (!isAdmin(userContextData)) {
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
