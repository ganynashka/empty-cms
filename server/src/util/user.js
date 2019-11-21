// @flow

import crypto from 'crypto';

import type {MongoUserType} from '../database/database-type';
import {getCollection} from '../database/database-helper';
import {dataBaseConst} from '../database/database-const';
import {passwordKey} from '../../key';
import {isError} from '../../../www/js/lib/is';

export type UserLoginPasswordType = {login: string, password: string};

export async function getUserByLogin(login: string): Promise<MongoUserType | null> {
    const collection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

    if (isError(collection)) {
        throw new Error(`Can not get collection: ${dataBaseConst.collection.user}`);
    }

    return collection.findOne({login});
}

export function getPasswordSha256(text: string): string {
    const sha256PasswordHmac = crypto.createHmac('sha256', passwordKey);

    return sha256PasswordHmac.update(text).digest('hex');
}
