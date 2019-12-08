// @flow

import type {MongoDocumentTreeNodeType, MongoDocumentType} from '../../../../server/src/database/database-type';

export type InitialRootDataType = {|
    +rootDocument: MongoDocumentType,
    +subDocumentList: Array<MongoDocumentType>,
|};

// eslint-disable-next-line no-use-before-define
type SetInitialDataType = (initialData: SetInitialDataArgumentType) => mixed;

export type SetInitialDataArgumentType = {|
    +title?: string,
    +description?: string,
    +is404?: boolean,
    +rootPathData?: InitialRootDataType | null,
    +articlePathData?: MongoDocumentType | null,
    +documentNodeTree?: MongoDocumentTreeNodeType | null,
    +setInitialData?: SetInitialDataType | null,
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

export type RouterStaticContextType = {
    url?: string,
    is404: boolean,
};
