// @flow

import type {MongoDocumentTreeNodeType, MongoDocumentType} from '../../../../server/src/database/database-type';
import type {DeviceDataType} from '../../../../server/src/util/device/device-type';

// eslint-disable-next-line no-use-before-define
type SetInitialDataType = (initialData: SetInitialDataArgumentType) => mixed;

export type SetInitialDataArgumentType = {|
    +header: string,
    +title: string,
    +meta: string,
    // +description?: string,
    +is404: boolean,
    +articlePathData?: MongoDocumentTreeNodeType | null,
    +documentNodeTree?: MongoDocumentTreeNodeType | null,
    +parentNodeList?: Array<MongoDocumentType>,
    +setInitialData?: SetInitialDataType | null,
    +device?: DeviceDataType | null,
|};

export type InitialDataType = {|
    +header: string,
    +title: string,
    +meta: string,
    // +description: string,
    +is404: boolean,
    +articlePathData: MongoDocumentTreeNodeType | null,
    +documentNodeTree: MongoDocumentTreeNodeType | null,
    +parentNodeList: Array<MongoDocumentType>,
    +setInitialData: SetInitialDataType | null,
    +device: DeviceDataType | null,
|};

export type RouterStaticContextType = {
    url?: string,
    is404: boolean,
};
