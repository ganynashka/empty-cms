// @flow

declare module 'mime-types' {
    declare type MimeTypesType = {
        +lookup: (src: string) => string | false,
    };

    declare export default MimeTypesType;
}
