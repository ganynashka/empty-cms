// @flow

/* eslint-disable jsx-a11y/media-has-caption */

import React, {type Node} from 'react';

import type {SnackbarContextType} from '../../../../../../../provider/snackbar/snackbar-context-type';
import {handleCopyAudioSrc} from '../file-preview-helper';
import filePreviewStyle from '../file-preview.scss';
import serviceStyle from '../../../../../../../../css/service.scss';
import {getNoHashFileName} from '../../../../../../../lib/string';
import {fileApiConst} from '../../../../../../../../../server/src/api/part/file-api-const';
import type {PreviewFileTypePropsType} from '../file-preview-type';

export function PreviewFileAudio(props: PreviewFileTypePropsType): Node {
    const {src, snackbarContext, children} = props;

    function handleOnClick(evt: SyntheticEvent<HTMLElement>) {
        handleCopyAudioSrc(evt, snackbarContext);
    }

    return (
        <button
            className={filePreviewStyle.file_wrapper}
            data-src={src}
            key={src}
            onClick={handleOnClick}
            type="button"
        >
            {children}
            <audio className={filePreviewStyle.file} controls src={fileApiConst.pathToUploadFiles + '/' + src}/>
            <span className={filePreviewStyle.file_name}>
                <span className={serviceStyle.ellipsis}>{getNoHashFileName(src)}</span>
            </span>
        </button>
    );
}
