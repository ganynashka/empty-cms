// @flow

import React, {type Node} from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import {isError} from '../../../lib/is';
import {SnackbarContextConsumer} from '../../../provider/snackbar/c-snackbar-context';

import {removeDocumentById} from './document-api';

type PropsType = {|
    +id: string,
    +onSuccess: () => Promise<mixed>,
|};

export function RemoveDocument(props: PropsType): Node {
    return (
        <SnackbarContextConsumer>
            {(snackbarContext: SnackbarContextType): Node => {
                async function handleOnClick() {
                    const {id, onSuccess} = props;
                    const removeResult = await removeDocumentById(id);
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

                    await onSuccess();

                    await showSnackbar({children: `${id} has been removed`, variant: 'success'}, 'document-removed');
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
