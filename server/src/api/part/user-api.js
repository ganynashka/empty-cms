// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {typeConverter} from '../../../../www/js/lib/type';
import {getSession} from '../../util/session';
import {getCollection} from '../../database/database-helper';
import type {MongoDocumentType, MongoUserFrontType, MongoUserType} from '../../database/database-type';
import {dataBaseConst, mongoUserRoleMap} from '../../database/database-const';
import {getTime} from '../../util/time';
import type {UserLoginPasswordType} from '../../util/user';
import {getPasswordSha256, getUserByLogin} from '../../util/user';
import {defaultUserFrontState} from '../../../../www/js/provider/user/user-context-const';
import {isError, isFunction} from '../../../../www/js/lib/is';
import {getListParameters} from '../api-helper';
import {userApiRouteMap} from '../api-route-map';

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
            response.status(500);
            response.json({
                isSuccessful: false,
                errorList: [`Can not get collection: ${dataBaseConst.collection.user}`],
            });
            return;
        }

        const {pageIndex, pageSize, sortParameter, sortDirection} = getListParameters(request);

        collection
            .find({})
            .sort({[sortParameter]: sortDirection})
            .skip(pageSize * pageIndex)
            .limit(pageSize)
            .toArray((error: Error | null, userList: Array<MongoUserType> | null) => {
                if (error || !Array.isArray(userList)) {
                    response.status(400);
                    response.json({
                        isSuccessful: false,
                        errorList: ['Can not read user collection!'],
                    });
                    return;
                }

                response.json(userList);
            });
    });

    app.get(userApiRouteMap.getUserListSize, async (request: $Request, response: $Response) => {
        const collection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

        if (isError(collection)) {
            response.status(500);
            response.json({
                isSuccessful: false,
                errorList: [`Can not get collection: ${dataBaseConst.collection.user}`],
            });
            return;
        }

        const count = await collection.countDocuments();

        response.send(String(count));
    });

    app.post(userApiRouteMap.register, async (request: $Request, response: $Response) => {
        const {login, password}: UserLoginPasswordType = typeConverter<UserLoginPasswordType>(request.body);

        const user = await getUserByLogin(login);

        if (user) {
            response.status(400);
            response.json({isSuccessful: false, errorList: ['User already exists.']});
            return;
        }

        const collection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

        if (isError(collection)) {
            response.status(400);
            response.json({
                isSuccessful: false,
                errorList: [`Can not get collection: ${dataBaseConst.collection.user}`],
            });
            return;
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
            response.status(400);
            response.json({isSuccessful: false, errorList: ['User is not exists.']});
            return;
        }

        if (user.passwordSha256 !== getPasswordSha256(password)) {
            response.status(400);
            response.json({isSuccessful: false, errorList: ['Password is wrong.']});
            return;
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

    app.get(userApiRouteMap.unLogin, async (request: $Request, response: $Response) => {
        const userSession = getSession(request);

        if (isFunction(userSession.destroy)) {
            userSession.destroy();
        }

        response.json({isSuccessful: true, errorList: []});
    });
}
