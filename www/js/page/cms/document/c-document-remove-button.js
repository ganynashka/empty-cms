// @flow

/* global window */

import React, {Component, type Node} from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import {isError} from '../../../lib/is';
import {SnackbarContextConsumer} from '../../../provider/snackbar/c-snackbar-context';

import {removeDocument} from './document-api';

type PropsType = {|
    +slug: string,
|};

export function RemoveDocument(props: PropsType): Node {
    return (
        <SnackbarContextConsumer>
            {(snackbarContext: SnackbarContextType): Node => {
                async function handleOnClick() {
                    const removeResult = await removeDocument(props.slug);
                    const {showSnackbar} = snackbarContext;

                    if (isError(removeResult)) {
                        await showSnackbar({children: removeResult.message, variant: 'error'}, removeResult.message);
                        return;
                    }

                    if (removeResult.errorList.length > 0) {
                        await showSnackbar(
                            {
                                children: removeResult.errorList.join(', '),
                                variant: 'error',
                            },
                            removeResult.errorList.join(',')
                        );
                        return;
                    }

                    await showSnackbar({children: 'Document has been removed', variant: 'success'}, 'document-removed');

                    window.location.reload();
                }

                return (
                    <button onClick={handleOnClick} type="button">
                        <DeleteForeverIcon/>
                    </button>
                );
            }}
        </SnackbarContextConsumer>
    );
}
