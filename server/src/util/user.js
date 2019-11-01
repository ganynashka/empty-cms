// @flow

import type {MongoUserType} from '../db/type';
import {getCollection} from '../db/util';
import {dataBaseConst} from '../db/const';

export async function getUserByLogin(login: string): Promise<MongoUserType | null> {
    const userCollection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

    return userCollection.findOne({login});
}
