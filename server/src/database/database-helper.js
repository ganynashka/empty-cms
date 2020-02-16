// @flow

import type {MongoCollection, MongoDataBase, MongoSortDirectionType} from 'mongodb';
import {MongoClient} from 'mongodb';

import type {NullableType} from '../../../www/js/lib/type';
import {hasProperty, isError} from '../../../www/js/lib/is';
import {promiseCatch} from '../../../www/js/lib/promise';

import {dataBaseConst} from './database-const';
import type {MongoDocumentShortDataType, MongoDocumentType} from './database-type';

const getDataBaseCache: {[key: string]: Promise<MongoDataBase>} = {};

export function getDataBase(name: string): Promise<MongoDataBase> {
    if (hasProperty(getDataBaseCache, name)) {
        // console.log('getDataBase: MongoDataBase get from cache, name:', name);
        return getDataBaseCache[name];
    }

    getDataBaseCache[name] = new Promise<MongoDataBase>(
        (resolve: MongoDataBase => mixed, reject: (error: Error) => mixed) => {
            MongoClient.connect(
                dataBaseConst.url,
                {
                    useUnifiedTopology: true,
                    useNewUrlParser: true,
                },
                (clientError: ?Error, client: ?MongoClient) => {
                    if (clientError) {
                        // console.error('Can not connect to mongo server');
                        reject(new Error('Can not connect to mongo server'));
                        return;
                    }

                    if (!client) {
                        // console.error('Mongo client is not define');
                        reject(new Error('Mongo client is not define'));
                        return;
                    }

                    resolve(client.db(name));
                }
            );
        }
    );

    return getDataBaseCache[name];
}

export function getCollection<ItemType>(
    dataBaseName: string,
    collectionName: string
): Promise<MongoCollection<ItemType> | Error> {
    return getDataBase(dataBaseName)
        .then((dataBase: MongoDataBase): MongoCollection<ItemType> => dataBase.collection<ItemType>(collectionName))
        .catch(promiseCatch);
}

export function getSortDirection(value: mixed): MongoSortDirectionType {
    const sortNumber = parseInt(value, 10);

    return sortNumber >= 0 ? 1 : -1;
}

async function updateUserType() {
    const collection = await getCollection<MongoDocumentType>(dataBaseConst.name, dataBaseConst.collection.document);

    if (isError(collection)) {
        console.error(collection.message);
        throw collection;
    }

    collection.find({}).toArray((error: ?Error, itemList: ?Array<MongoDocumentType>) => {
        if (error || !itemList) {
            console.error('---> !!! error');
            console.error(error);
            console.log('---> !!! itemList');
            console.log(itemList);
            return;
        }

        itemList.forEach((item: MongoDocumentType) => {
            console.log('---> item');
            // console.log(item);
            //
            const {title, slug, id} = item;

            console.log(title, slug, id);

            if (id) {
                // console.log('already has id', title, slug, id);
                return;
            }

            // collection.updateOne({slug}, {$set: {id: 'id-for-' + slug}}, {});
        });
    });

    // userCollection.updateMany({}, {$set: {registerDate: getTime()}}, {}, function () {
    //     console.log(arguments);
    // });
    // userCollection.updateMany({}, {$unset: {register: ''}}, {}, function () {
    //     console.log(arguments);
    // });
}

updateUserType();
