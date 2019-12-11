// @flow

import React, {type Node} from 'react';
import mime from 'mime-types';

import type {SnackbarContextType} from '../../../../../../../provider/snackbar/snackbar-context-type';
import serviceStyle from '../../../../../../../../css/service.scss';
import {getNoHashFileName} from '../../../../../../../lib/string';
import {handleCopySrc} from '../file-preview-helper';
import filePreviewStyle from '../file-preview.scss';
import type {PreviewFileTypePropsType} from '../file-preview-type';

export function PreviewFileNaFile(props: PreviewFileTypePropsType): Node {
    const {src, snackbarContext, children} = props;
    const mimeType = String(mime.lookup(src) || 'N/A');

    function handleOnClick(evt: SyntheticEvent<HTMLElement>) {
        handleCopySrc(evt, snackbarContext);
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
            <span className={filePreviewStyle.file__mime_type}>{mimeType}</span>
            <span className={filePreviewStyle.file_name}>
                <span className={serviceStyle.ellipsis}>{getNoHashFileName(src)}</span>
            </span>
        </button>
    );
}
