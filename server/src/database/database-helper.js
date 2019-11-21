// @flow

import type {MongoCollection, MongoDataBase, MongoSortDirectionType} from 'mongodb';
import {MongoClient} from 'mongodb';

import type {NullableType} from '../../../www/js/lib/type';
import {hasProperty, isError} from '../../../www/js/lib/is';
import {promiseCatch} from '../../../www/js/lib/promise';

import {dataBaseConst} from './database-const';

const getDataBaseCache: {[key: string]: Promise<MongoDataBase>} = {};

export function getDataBase(name: string): Promise<MongoDataBase> {
    if (hasProperty(getDataBaseCache, name)) {
        console.log('getDataBase: MongoDataBase get from cache, name:', name);
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
                (clientError: NullableType<Error>, client: NullableType<MongoClient>) => {
                    if (isError(clientError)) {
                        console.error('Can not connect to mongo server');
                        reject(new Error('Can not connect to mongo server'));
                        return;
                    }

                    if (client === null) {
                        console.error('Mongo client is not define');
                        reject(new Error('Mongo client is not define'));
                        return;
                    }

                    resolve(client.db(name));
                }
            );
        }
    );

    console.log('getDataBase: MongoDataBase defined');

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

/*
// change user type
async function updateUserType() {
    const userCollection = await await await getCollection<MongoUserType>(
        dataBaseConst.name,
        dataBaseConst.collection.user
    );

    userCollection.find({}).each(function (error: Error | null, userData: MongoUserType | null) {
        if (error || !userData) {
            console.error('---> !!! error');
            console.error(error);
            console.log('---> !!! userData');
            console.log(userData);
            return;
        }

        console.log('---> userData');
        console.log(userData);

        // const {id, password} = userData;
        //
        // console.log(id, password);

        // userCollection.updateOne({id}, {$set: {password: getPasswordSha256(password)}}, {});
    });

    // userCollection.updateMany({}, {$set: {registerDate: getTime()}}, {}, function () {
    //     console.log(arguments);
    // });
    // userCollection.updateMany({}, {$unset: {register: ''}}, {}, function () {
    //     console.log(arguments);
    // });
}

updateUserType();
*/
