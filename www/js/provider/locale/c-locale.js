// @flow

import React, {type Node} from 'react';

import type {LocaleContextValueMapType, LocaleContextType} from './locale-context-type';
import {getLocalizedString} from './locale-context-helper';
import type {LangKeyType} from './translation/type';
import {LocaleContextConsumer} from './c-locale-context';

type PropsType = {|
    +stringKey: LangKeyType,
    +valueMap?: LocaleContextValueMapType,
|};

export function Locale(props: PropsType): Node {
    const {stringKey, valueMap} = props;

    return (
        <LocaleContextConsumer>
            {(localeContext: LocaleContextType): string => getLocalizedString(stringKey, localeContext.name, valueMap)}
        </LocaleContextConsumer>
    );
}
