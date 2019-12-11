// @flow

import React, {Component, type Node} from 'react';
import mime from 'mime-types';

import {SnackbarContextConsumer} from '../../../../../../provider/snackbar/c-snackbar-context';
import type {SnackbarContextType} from '../../../../../../provider/snackbar/snackbar-context-type';

import {PreviewFileNaFile} from './preview-type/c-preview-na-file';
import {PreviewFileImage} from './preview-type/c-preview-image';
import {PreviewFileAudio} from './preview-type/c-preview-audio';
import {PreviewFileVideo} from './preview-type/c-preview-video';

type PropsType = {|
    +src: string,
    +children?: Node,
|};

export class FilePreview extends Component<PropsType, null> {
    renderFileContent(snackbarContext: SnackbarContextType): Node {
        const {props} = this;
        const {src, children} = props;
        const mimeType = String(mime.lookup(src) || '');

        if (mimeType.startsWith('image/')) {
            return (
                <PreviewFileImage snackbarContext={snackbarContext} src={src}>
                    {children}
                </PreviewFileImage>
            );
        }

        if (mimeType.startsWith('audio/')) {
            return (
                <PreviewFileAudio snackbarContext={snackbarContext} src={src}>
                    {children}
                </PreviewFileAudio>
            );
        }

        if (mimeType.startsWith('video/')) {
            return (
                <PreviewFileVideo snackbarContext={snackbarContext} src={src}>
                    {children}
                </PreviewFileVideo>
            );
        }

        return (
            <PreviewFileNaFile snackbarContext={snackbarContext} src={src}>
                {children}
            </PreviewFileNaFile>
        );
    }

    render(): Node {
        return (
            <SnackbarContextConsumer>
                {(snackbarContext: SnackbarContextType): Node => {
                    return this.renderFileContent(snackbarContext);
                }}
            </SnackbarContextConsumer>
        );
    }
}
