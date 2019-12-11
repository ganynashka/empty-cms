// @flow

import React, {type Node} from 'react';

import type {SnackbarContextType} from '../../../../../../../provider/snackbar/snackbar-context-type';
import {getResizedImage} from '../../../../../../../page/cms/file/file-api';
import serviceStyle from '../../../../../../../../css/service.scss';
import {getNoHashFileName} from '../../../../../../../lib/string';
import {handleCopyImageSrc} from '../file-preview-helper';
import filePreviewStyle from '../file-preview.scss';
import type {PreviewFileTypePropsType} from '../file-preview-type';

export function PreviewFileImage(props: PreviewFileTypePropsType): Node {
    const {src, snackbarContext, children} = props;

    function handleOnClick(evt: SyntheticEvent<HTMLElement>) {
        handleCopyImageSrc(evt, snackbarContext);
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
            <img alt="" className={filePreviewStyle.file} src={getResizedImage(src, 256, 256)}/>
            <span className={filePreviewStyle.file_name}>
                <span className={serviceStyle.ellipsis}>{getNoHashFileName(src)}</span>
            </span>
        </button>
    );
}
