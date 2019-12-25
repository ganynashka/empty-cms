// @flow

import type {MongoDocumentTreeNodeType} from '../../../../server/src/database/database-type';

// eslint-disable-next-line no-use-before-define
type SetInitialDataType = (initialData: SetInitialDataArgumentType) => mixed;

export type SetInitialDataArgumentType = {|
    +title: string,
    +meta: string,
    // +description?: string,
    +is404: boolean,
    +articlePathData?: MongoDocumentTreeNodeType | null,
    +documentNodeTree?: MongoDocumentTreeNodeType | null,
    +setInitialData?: SetInitialDataType | null,
|};

export type InitialDataType = {|
    +title: string,
    +meta: string,
    // +description: string,
    +is404: boolean,
    +articlePathData: MongoDocumentTreeNodeType | null,
    +documentNodeTree: MongoDocumentTreeNodeType | null,
    +setInitialData: SetInitialDataType | null,
|};

export type RouterStaticContextType = {
    url?: string,
    is404: boolean,
};
