// @flow

import type {LangKeyType} from './translation/type';

export type LocaleContextValueMapType = {
    +[key: string]: string | number,
};

export type LocaleNameType = 'en-US' | 'ru-RU' | 'zh-CN' | 'zh-TW';

export type LocaleContextType = {|
    +name: LocaleNameType,
    +setName: (localeName: LocaleNameType) => mixed,
    +getLocalizedString: (stringKey: LangKeyType, valueMap?: LocaleContextValueMapType) => string,
|};
