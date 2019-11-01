// @flow

import {type $Application, type $Request, type $Response} from 'express';

import type {ApiDataType} from '../../www/js/component/need-end-point/c-need-end-point';
import {typeConverter} from '../../www/js/lib/type';

import {getSession} from './util/session';
import {getCollection} from './db/util';
import type {MongoDocumentType, MongoUserType} from './db/type';
import {dataBaseConst} from './db/const';
import {getTime} from './util/time';
import {getUserByLogin} from './util/user';
import type {UserLoginPasswordType} from './util/user';

const streamOptionsArray = {transform: (item: {}): string => JSON.stringify(item) + ','};

export function addApiIntoApplication(app: $Application) {
    app.get('/api/some-api-url', async (request: $Request, response: $Response) => {
        const apiData: ApiDataType = {status: 'success'};

        response.json(apiData);
    });

    // user - get list
    app.get('/api/get-user-list', async (request: $Request, response: $Response) => {
        console.log('---> /api/get-user-list');

        const collection = await getCollection<MongoUserType>(dataBaseConst.name, dataBaseConst.collection.user);

        // TODO: try to remove "await", because work without it
        (await collection)
            .find({})
            .stream(streamOptionsArray)
            .pipe(response.type('json'));
    });

    // user - get create/register
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
            login,
            password,
            role: 'user',
            id: String(date + Math.random()),
            rating: 0,
            register: {
                date,
            },
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

        if (user.password !== password) {
            response.json({success: false, errorList: ['Password is wrong.']});
            return;
        }

        const userSession = getSession(request);

        userSession.login = login;

        console.log('--- user ---');
        console.log(user);

        response.json({success: true, errorList: []});
    });

    // document - get list
    app.get('/api/get-document-list', async (request: $Request, response: $Response) => {
        console.log('---> /api/get-document-list');

        const collection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        // TODO: try to remove "await", because work without it
        (await collection)
            .find({})
            .stream(streamOptionsArray)
            .pipe(response.type('json'));
    });

    // document - create
    app.post('/api/create-document', async (request: $Request, response: $Response) => {
        console.log('---> /api/create-document');

        const mongoDocument: MongoDocumentType = typeConverter<MongoDocumentType>(request.body);

        const documentCollection = await getCollection<MongoDocumentType>(
            dataBaseConst.name,
            dataBaseConst.collection.document
        );

        console.log('---- mongoDocument ----');
        console.log(mongoDocument);

        const date = getTime();

        const newDocument: MongoDocumentType = {
            ...mongoDocument,
            createdDate: date,
            updatedDate: date,
        };

        await documentCollection.insertOne(newDocument);

        response.json({created: true});
    });
}
