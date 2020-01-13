// @flow

export type JsonToMongoDocumentItemType = {
    +src: string,
    +text: string,
};

export type JsonToMongoDocumentType = {
    +title: string,
    +header: string,
    +author: string,
    +illustrator: string,
    +artist: string,
    +itemList: Array<JsonToMongoDocumentItemType>,
};
