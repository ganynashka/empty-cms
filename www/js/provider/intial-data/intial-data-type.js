// @flow

import type {
    MongoDocumentLinkType,
    MongoDocumentTreeNodeType,
    MongoDocumentType,
} from '../../../../server/src/database/database-type';
import type {DeviceDataType} from '../../../../server/src/util/device/device-type';

// eslint-disable-next-line no-use-before-define
type SetInitialDataType = (initialData: SetInitialDataArgumentType) => mixed;

type NullableType<Type> = Type | null;

export type SetInitialDataArgumentType = {|
    +header: string,
    +title: string,
    +meta: string,
    +is404: boolean,
    +articlePathData?: NullableType<MongoDocumentTreeNodeType>,
    +documentNodeTree?: NullableType<MongoDocumentTreeNodeType>,
    +parentNodeList?: Array<MongoDocumentType>,
    +setInitialData?: NullableType<SetInitialDataType>,
    +device?: NullableType<DeviceDataType>,
    +siblingDataList?: Array<MongoDocumentLinkType>,
|};

export type InitialDataType = {|
    +header: string,
    +title: string,
    +meta: string,
    +is404: boolean,
    +articlePathData: NullableType<MongoDocumentTreeNodeType>,
    +documentNodeTree: NullableType<MongoDocumentTreeNodeType>,
    +parentNodeList: Array<MongoDocumentType>,
    +setInitialData: NullableType<SetInitialDataType>,
    +device: NullableType<DeviceDataType>,
    +siblingDataList: Array<MongoDocumentLinkType>,
|};

export type RouterStaticContextType = {
    url?: string,
    is404: boolean,
};
