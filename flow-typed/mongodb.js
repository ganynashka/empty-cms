// @flow

declare module 'mongodb' {
    declare export type MongoSortDirectionType = 1 | -1;

    declare type MongoClientConnectCallBackType = (connectError: Error | null, client: MongoClient | null) => mixed;

    declare type MongoCollectionActionOperationType = {};

    declare export type MongoCollectionActionResultType = {
        ops: Array<MongoCollectionActionOperationType>,
    };

    declare type MongoCollectionCursorStreamOptionType<ItemType> = {
        transform?: (item: ItemType) => mixed,
    };

    declare type MongoCollectionCursorIteratorType<ItemType> = (
        mayBeError: Error | null,
        item: ItemType | null,
    ) => mixed;

    declare export class MongoCollectionCursor<ItemType> {
        each: MongoCollectionCursorIteratorType<ItemType>,
        stream: (option: MongoCollectionCursorStreamOptionType<ItemType>) => MongoCollectionCursor<ItemType>,
        limit: (size: number) => MongoCollectionCursor<ItemType>,
        skip: (size: number) => MongoCollectionCursor<ItemType>,
        sort: (sort: {[key: string]: MongoSortDirectionType}) => MongoCollectionCursor<ItemType>,
        toArray: (callBack: (error: Error | null, array: Array<ItemType> | null) => mixed) => mixed,
        pipe: (destination: mixed) => mixed,
    }

    declare type MongoCollectionFindOption = {
        +limit?: number,
        +skip?: number,
        +timeout?: boolean,
        +maxTimeMS?: number,
    };

    declare export class MongoCollection<ItemType> {
        insertOne: (item: ItemType) => Promise<MongoCollectionActionResultType>,
        insertMany: (itemList: Array<ItemType>) => Promise<MongoCollectionActionResultType>,
        find: (item: $Shape<ItemType>, options?: MongoCollectionFindOption) => MongoCollectionCursor<ItemType>,
        findOne: (item: $Shape<ItemType>) => Promise<ItemType | null>,
        updateMany: (
            filter: $Shape<ItemType>,
            update: {},
            options: {},
        ) => Promise<Error | MongoCollectionActionResultType>,
        updateOne: (
            filter: $Shape<ItemType>,
            update: {},
            options: {},
        ) => Promise<Error | MongoCollectionActionResultType>,
        countDocuments: () => Promise<number>,
    }

    declare export class MongoDataBase {
        collection: <ItemType>(collectionName: string) => MongoCollection<ItemType>,
    }

    declare type MongoClientOptionType = {
        useUnifiedTopology?: boolean,
        useNewUrlParser?: boolean,
    };

    declare export class MongoClient {
        static connect: (
            url: string,
            option?: MongoClientOptionType,
            callBack: MongoClientConnectCallBackType,
        ) => mixed,
        db: (dataBaseName: string) => MongoDataBase,
        close: (closeCallBack: (Error | null) => mixed) => mixed,
    }
}
