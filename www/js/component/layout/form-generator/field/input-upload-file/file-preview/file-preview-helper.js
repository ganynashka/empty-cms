// @flow

/* global navigator */

import {getMarkdownAudio, getMarkdownResizedImage} from '../../../../../../page/cms/file/file-api';
import {promiseCatch} from '../../../../../../lib/promise';
import {isError} from '../../../../../../lib/is';
import {fileApiConst} from '../../../../../../../../server/src/api/part/file-api-const';
import type {SnackbarContextType} from '../../../../../../provider/snackbar/snackbar-context-type';

export async function handleCopyImageSrc(evt: SyntheticEvent<HTMLElement>, snackbarContext: SnackbarContextType) {
    const snackBarId = 'copy-image-markdown-snack-bar-id-' + String(Date.now());
    const {showSnackbar} = snackbarContext;

    const src = String(evt.currentTarget.dataset.src);
    const imageMarkdown = getMarkdownResizedImage(src);

    if (!navigator.clipboard) {
        await showSnackbar({children: imageMarkdown, variant: 'error'}, snackBarId);

        /*
        await showSnackbar(
            {children: 'Your browser DO NOT support \'navigator.clipboard\'!', variant: 'error'},
            snackBarId
        );
        */
        return;
    }

    const copyResult = await navigator.clipboard.writeText(imageMarkdown).catch(promiseCatch);

    if (isError(copyResult)) {
        await showSnackbar({children: 'Can not copy image markdown!', variant: 'error'}, snackBarId);
        return;
    }

    await showSnackbar({children: 'Copy as markdown!', variant: 'success'}, snackBarId);
}

export async function handleCopyAudioSrc(evt: SyntheticEvent<HTMLElement>, snackbarContext: SnackbarContextType) {
    const snackBarId = 'copy-image-markdown-snack-bar-id-' + String(Date.now());
    const {showSnackbar} = snackbarContext;

    const src = String(evt.currentTarget.dataset.src);
    const imageMarkdown = getMarkdownAudio(src);

    if (!navigator.clipboard) {
        await showSnackbar({children: imageMarkdown, variant: 'error'}, snackBarId);

        /*
        await showSnackbar(
            {children: 'Your browser DO NOT support \'navigator.clipboard\'!', variant: 'error'},
            snackBarId
        );
        */
        return;
    }

    const copyResult = await navigator.clipboard.writeText(imageMarkdown).catch(promiseCatch);

    if (isError(copyResult)) {
        await showSnackbar({children: 'Can not copy image markdown!', variant: 'error'}, snackBarId);
        return;
    }

    await showSnackbar({children: 'Copy as markdown!', variant: 'success'}, snackBarId);
}

export async function handleCopySrc(evt: SyntheticEvent<HTMLElement>, snackbarContext: SnackbarContextType) {
    const snackBarId = 'copy-file-src-snack-bar-id-' + String(Date.now());
    const {showSnackbar} = snackbarContext;

    const src = fileApiConst.pathToUploadFiles + '/' + String(evt.currentTarget.dataset.src);

    if (!navigator.clipboard) {
        await showSnackbar({children: src, variant: 'error'}, snackBarId);

        /*
        await showSnackbar(
            {children: 'Your browser DO NOT support \'navigator.clipboard\'!', variant: 'error'},
            snackBarId
        );
        */
        return;
    }

    const copyResult = await navigator.clipboard.writeText(src).catch(promiseCatch);

    if (isError(copyResult)) {
        await showSnackbar({children: 'Can not copy file src!', variant: 'error'}, snackBarId);
        return;
    }

    await showSnackbar({children: 'Copy as src!', variant: 'success'}, snackBarId);
}
