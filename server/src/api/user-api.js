// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {typeConverter} from '../../../www/js/lib/type';
import {getSession} from '../util/session';
import {getCollection} from '../db/util';
import type {MongoUserFrontType, MongoUserType} from '../db/type';
import {mongoUserRoleMap} from '../db/type';
import {dataBaseConst} from '../db/const';
import {getTime} from '../util/time';
import type {UserLoginPasswordType} from '../util/user';
import {getPasswordSha256, getUserByLogin} from '../util/user';
import {defaultUserFrontState} from '../../../www/js/component/user/const-user-context';
import {isError} from '../../../www/js/lib/is';

import {getListParameters, streamOptionsArray} from './helper';
import {userApiRouteMap} from './route-map';

export function addUserApi(app: $Application) {
    app.get(userApiRouteMap.getCurrentUser, async (request: $Request, response: $Response) => {
        const userSession = getSession(request);
        const user = await getUserByLogin(userSession.login || '');

        if (user === null) {
            response.json(defaultUserFrontState);
            return;
        }

        const {role, login, registerDate, rating} = user;
        const frontUser: MongoUserFrontType = {role, login, registerDate, rating};

        response.json(frontUser);
    });

    app.get(userApiRouteMap.getUserList, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

        if (isError(collection)) {
            throw new Error(`Can not get collection: ${dataBaseConst.collection.user}`);
        }

        const {pageIndex, pageSize, sortParameter, sortDirection} = getListParameters(request);

        collection
            .find({})
            .sort({[sortParameter]: sortDirection})
            .skip(pageSize * pageIndex)
            .limit(pageSize)
            .stream(streamOptionsArray)
            .pipe(response.type('json'));
    });

    app.get(userApiRouteMap.getUserListSize, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

        if (isError(collection)) {
            throw new Error(`Can not get collection: ${dataBaseConst.collection.user}`);
        }

        const count = await collection.countDocuments();

        response.send(String(count));
    });

    app.post(userApiRouteMap.register, async (request: $Request, response: $Response) => {
        const {login, password}: UserLoginPasswordType = typeConverter<UserLoginPasswordType>(request.body);

        const user = await getUserByLogin(login);

        if (user) {
            response.json({isSuccessful: false, errorList: ['User already exists.']});
            return;
        }

        const collection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

        if (isError(collection)) {
            throw new Error(`Can not get collection: ${dataBaseConst.collection.user}`);
        }

        const date = getTime();

        const newUser: MongoUserType = {
            id: String(date) + '-' + String(Math.random()),
            role: mongoUserRoleMap.user,
            login,
            passwordSha256: getPasswordSha256(password),
            rating: 0,
            registerDate: date,
        };

        await collection.insertOne(newUser);

        response.json({isSuccessful: true, errorList: []});
    });

    app.post(userApiRouteMap.login, async (request: $Request, response: $Response) => {
        const {login, password}: UserLoginPasswordType = typeConverter<UserLoginPasswordType>(request.body);
        const user = await getUserByLogin(login);

        if (user === null) {
            throw new Error('User is not exists.');
        }

        if (user.passwordSha256 !== getPasswordSha256(password)) {
            throw new Error('Password is wrong.');
        }

        const userSession = getSession(request);

        // $FlowFixMe
        Object.assign(userSession, {login, role: user.role});

        const frontUser: MongoUserFrontType = {
            role: user.role,
            login: user.login,
            registerDate: user.registerDate,
            rating: user.rating,
        };

        response.json(frontUser);
    });
}
