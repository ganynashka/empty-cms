// @flow

import type {MongoCollection, MongoDataBase, SortDirectionType} from 'mongodb';
import {MongoClient} from 'mongodb';

import type {NullableType} from '../../../www/js/lib/type';
import {hasProperty} from '../../../www/js/lib/is';

import {dataBaseConst} from './const';

// export type SortDirectionType = 1 | -1;

const getDataBaseCache: {[key: string]: Promise<MongoDataBase>} = {};

export async function getDataBase(name: string): Promise<MongoDataBase> {
    if (hasProperty(getDataBaseCache, name)) {
        console.log('getDataBase: MongoDataBase get from cache, name:', name);
        return getDataBaseCache[name];
    }

    getDataBaseCache[name] = new Promise<MongoDataBase>((resolve: MongoDataBase => mixed) => {
        MongoClient.connect(
            dataBaseConst.url,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
            },
            (clientError: NullableType<Error>, client: NullableType<MongoClient>) => {
                if (clientError instanceof Error) {
                    throw new TypeError('Can not connect to mongo server');
                }

                if (client === null) {
                    throw new Error('Mongo client is not define');
                }

                resolve(client.db(name));
            }
        );
    });

    console.log('getDataBase: MongoDataBase defined');

    return getDataBaseCache[name];
}

export async function getCollection<ItemType>(
    dataBaseName: string,
    collectionName: string
): Promise<MongoCollection<ItemType>> {
    const dataBase = await getDataBase(dataBaseName);

    return dataBase.collection<ItemType>(collectionName);
}

export function getSortDirection(value: mixed): SortDirectionType {
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
