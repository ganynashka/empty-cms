// @flow

export type JsonToMongoDocumentItemType = {
    +src: string,
    +text: string,
};

export type JsonToMongoDocumentType = {
    +header: string,
    +author: string,
    +illustrator: string,
    +artist: string,
    +itemList: Array<JsonToMongoDocumentItemType>,
};
