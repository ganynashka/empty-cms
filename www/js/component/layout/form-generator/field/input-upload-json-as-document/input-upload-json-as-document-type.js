// @flow

export type JsonToMongoDocumentItemType = {
    src: string,
    text: string,
};

export type JsonToMongoDocumentType = {
    title: string,
    itemList: Array<JsonToMongoDocumentItemType>,
};
