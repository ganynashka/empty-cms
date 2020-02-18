// @flow

import type {
    MongoDocumentShortDataType,
    MongoDocumentType,
    OpenGraphDataType,
} from '../../../../server/src/database/database-type';
import type {DeviceDataType} from '../../../../server/src/util/device/device-type';

// eslint-disable-next-line no-use-before-define
// type SetInitialDataType = (initialData: SetInitialDataArgumentType) => mixed;
type RefreshInitialDataInitialDataType = (url: string) => Promise<null | Error>;

type NullableType<Type> = Type | null;

export type ArticlePathDataType = {|
    +mongoDocument: MongoDocumentType,
    +sudNodeShortDataList: Array<MongoDocumentShortDataType>,
|};

export type RootPathDataType = {|
    +mongoDocument: MongoDocumentType,
    +subDocumentList: Array<MongoDocumentType>,
|};

export type HeaderDataType = {|
    +documentShortDataList: Array<MongoDocumentShortDataType>,
|};

export type SetInitialDataArgumentType = {|
    +header: string,
    +title: string,
    +meta: string,
    +openGraphData?: NullableType<OpenGraphDataType>,
    +is404: boolean,
    +articlePathData?: NullableType<ArticlePathDataType>,
    +rootPathData?: NullableType<RootPathDataType>,
    +headerData?: NullableType<HeaderDataType>,
    +parentNodeList?: Array<MongoDocumentShortDataType>,
    // +setInitialData?: NullableType<SetInitialDataType>,
    +refreshInitialData?: NullableType<RefreshInitialDataInitialDataType>,
    +device?: NullableType<DeviceDataType>,
    +siblingDataList?: Array<MongoDocumentShortDataType>,
    +isConnectionError?: boolean,
|};

export type InitialDataType = {|
    +header: string,
    +title: string,
    +meta: string,
    +openGraphData: NullableType<OpenGraphDataType>,
    +is404: boolean,
    +articlePathData: NullableType<ArticlePathDataType>,
    +rootPathData: NullableType<RootPathDataType>,
    +headerData: NullableType<HeaderDataType>,
    +parentNodeList: Array<MongoDocumentShortDataType>,
    // +setInitialData: NullableType<SetInitialDataType>,
    +refreshInitialData: NullableType<RefreshInitialDataInitialDataType>,
    +device: NullableType<DeviceDataType>,
    +siblingDataList: Array<MongoDocumentShortDataType>,
    +isConnectionError?: boolean,
|};

export type RouterStaticContextType = {
    url?: string,
    is404: boolean,
};
