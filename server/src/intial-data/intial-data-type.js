// @flow

import type {MongoDocumentType} from '../database/database-type';

export type InitialRootDataType = {|
    +rootDocument: MongoDocumentType,
    +subDocumentList: Array<MongoDocumentType>,
|};

export type InitialDataType = {|
    +title: string,
    +description: string,
    +is404: boolean,
    +rootPathData: InitialRootDataType | null,
    +articlePathData: MongoDocumentType | null,
|};

/*
export type RouterStaticContextType = {
    url?: string,
    is404: boolean,
};
*/
