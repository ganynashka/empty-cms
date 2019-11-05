// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {typeConverter} from '../../../www/js/lib/type';
import {getSession} from '../util/session';
import {getCollection} from '../db/util';
import type {MongoUserType} from '../db/type';
import {dataBaseConst} from '../db/const';
import {getTime} from '../util/time';
import type {UserLoginPasswordType} from '../util/user';
import {getPasswordSha256, getUserByLogin} from '../util/user';

import {getListParameters, streamOptionsArray} from './helper';

export function addUserApi(app: $Application) {
    app.get('/api/get-user-list', async (request: $Request, response: $Response) => {
        console.log(
            '---> /api/get-user-list?page-index=11&page-size=33&sort-direction=1|-1&sort-parameter=register.date'
        );

        const collection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

        const {pageIndex, pageSize, sortParameter, sortDirection} = getListParameters(request);

        console.log('---> get user list', pageSize, pageIndex, sortParameter, sortDirection);

        // TODO: try to remove "await", because work without it
        (await collection)
            .find({})
            .sort({[sortParameter]: sortDirection})
            .skip(pageSize * pageIndex)
            .limit(pageSize)
            .stream(streamOptionsArray)
            .pipe(response.type('json'));
    });

    app.get('/api/get-user-list-size', async (request: $Request, response: $Response) => {
        console.log('---> /api/get-user-list-size');

        const collection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

        const count = await collection.countDocuments();

        response.send(String(count));
    });

    app.post('/api/register', async (request: $Request, response: $Response) => {
        console.log('---> /api/register');

        const {login, password}: UserLoginPasswordType = typeConverter<UserLoginPasswordType>(request.body);

        const user = await getUserByLogin(login);

        if (user) {
            response.json({success: false, errorList: ['User already exists.']});
            return;
        }

        const userCollection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

        const date = getTime();

        const newUser: MongoUserType = {
            id: String(date) + '-' + String(Math.random()),
            role: 'user',
            login,
            passwordSha256: getPasswordSha256(password),
            rating: 0,
            registerDate: date,
        };

        await userCollection.insertOne(newUser);

        response.json({success: true, errorList: []});
    });

    // user - get login
    app.post('/api/login', async (request: $Request, response: $Response) => {
        console.log('---> /api/login');

        const {login, password}: UserLoginPasswordType = typeConverter<UserLoginPasswordType>(request.body);
        const user = await getUserByLogin(login);

        if (user === null) {
            response.json({success: false, errorList: ['User is not exists.']});
            return;
        }

        if (user.passwordSha256 !== getPasswordSha256(password)) {
            response.json({success: false, errorList: ['Password is wrong.']});
            return;
        }

        const userSession = getSession(request);

        userSession.login = login;

        console.log('--- user ---');
        console.log(user);

        response.json({success: true, errorList: []});
    });
}
