// @flow

export type ThemeNameType = 'default' | 'dark';

export type ThemeContextType = {|
    +name: ThemeNameType,
    +setName: (themeName: ThemeNameType) => mixed,
|};
