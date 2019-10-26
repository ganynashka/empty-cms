// @flow

declare module 'mongodb' {
    declare type MongoClientConnectCallBackType = (connectError: Error | null, client: MongoClient | null) => mixed;

    declare type MongoCollectionActionOperationType = {};

    declare export type MongoCollectionActionResultType = {
        ops: Array<MongoCollectionActionOperationType>,
    };

    declare export class MongoCollection<ItemType> {
        insertMany: (itemList: Array<ItemType>) => Promise<MongoCollectionActionResultType>,
        insertOne: (item: ItemType) => Promise<MongoCollectionActionResultType>,
        findOne: (item: $Shape<ItemType>) => Promise<ItemType | null>,
    }

    declare export class MongoDataBase {
        collection: <ItemType>(collectionName: string) => MongoCollection<ItemType>,
    }

    declare export class MongoClient {
        static connect: (url: string, callBack: MongoClientConnectCallBackType) => mixed,
        db: (dataBaseName: string) => MongoDataBase,
        close: (closeCallBack: (Error | null) => mixed) => mixed,
    }
}
