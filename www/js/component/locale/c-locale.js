// @flow

import React, {type Node} from 'react';

import type {ValueMapType} from './locale-helper';
import {getLocalizedString} from './locale-helper';
import type {LangKeyType} from './translation/type';
import type {LocaleContextType} from './c-locale-context';
import {LocaleContextConsumer} from './c-locale-context';

type LocalePropsType = {|
    +stringKey: LangKeyType,
    +valueMap?: ValueMapType,
|};

export function Locale(props: LocalePropsType): Node {
    const {stringKey, valueMap} = props;

    return (
        <LocaleContextConsumer>
            {(localeContext: LocaleContextType): string => getLocalizedString(stringKey, localeContext.name, valueMap)}
        </LocaleContextConsumer>
    );
}
