// @flow

import crypto from 'crypto';

import type {MongoUserType} from '../db/type';
import {getCollection} from '../db/util';
import {dataBaseConst} from '../db/const';
import {passwordKey} from '../../key';

export type UserLoginPasswordType = {login: string, password: string};

export async function getUserByLogin(login: string): Promise<MongoUserType | null> {
    const userCollection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

    return userCollection.findOne({login});
}

const sha256PasswordHmac = crypto.createHmac('sha256', passwordKey);

export function getPasswordSha256(text: string): string {
    return sha256PasswordHmac.update(text).digest('hex');
}
