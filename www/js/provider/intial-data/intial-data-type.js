// @flow

import type {MongoDocumentTreeNodeType, MongoDocumentType} from '../../../../server/src/database/database-type';

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
    +documentNodeTree: MongoDocumentTreeNodeType | null,
    +setInitialData: SetInitialDataType | null,
|};

type SetInitialDataType = (initialData: InitialDataType) => mixed;

export type RouterStaticContextType = {
    url?: string,
    is404: boolean,
};
