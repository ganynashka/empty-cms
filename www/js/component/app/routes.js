// @flow

import {Home} from '../../page/home/c-home';

import {routePathMap} from './routes-path-map';

export const routeItemMap = {
    home: {
        path: routePathMap.home.path,
        component: Home,
        type: 'route',
    },
    userList: {
        path: routePathMap.userList.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return (
                import(/* webpackChunkName: 'async-user-list' */ '../../page/user/c-user-list')
                    // eslint-disable-next-line id-match
                    .then((data: {UserList: React$ComponentType<*>}): React$ComponentType<*> => data.UserList)
            );
        },
        type: 'route',
    },
    documentList: {
        path: routePathMap.documentList.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return (
                import(/* webpackChunkName: 'async-document-list' */ '../../page/document/c-document-list')
                    // eslint-disable-next-line id-match
                    .then((data: {DocumentList: React$ComponentType<*>}): React$ComponentType<*> => data.DocumentList)
            );
        },
        type: 'route',
    },
    documentTree: {
        path: routePathMap.documentTree.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return import(
                /* webpackChunkName: 'async-document-tree-view' */ '../../page/document/c-document-tree-view'
            ).then(
                // eslint-disable-next-line id-match
                (data: {DocumentTreeView: React$ComponentType<*>}): React$ComponentType<*> => data.DocumentTreeView
            );
        },
        type: 'route',
    },
    documentCreate: {
        path: routePathMap.documentCreate.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return import(/* webpackChunkName: 'async-document-create' */ '../../page/document/c-document-create').then(
                // eslint-disable-next-line id-match
                (data: {DocumentCreate: React$ComponentType<*>}): React$ComponentType<*> => data.DocumentCreate
            );
        },
        type: 'route',
    },
    documentEdit: {
        path: routePathMap.documentEdit.path,
        staticPartPath: routePathMap.documentEdit.staticPartPath,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return (
                import(/* webpackChunkName: 'async-document-edit' */ '../../page/document/c-document-edit')
                    // eslint-disable-next-line id-match
                    .then((data: {DocumentEdit: React$ComponentType<*>}): React$ComponentType<*> => data.DocumentEdit)
            );
        },
        type: 'route',
    },
    login: {
        path: routePathMap.login.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return (
                import(/* webpackChunkName: 'async-login' */ '../../page/login/c-login')
                    // eslint-disable-next-line id-match
                    .then((data: {Login: React$ComponentType<*>}): React$ComponentType<*> => data.Login)
            );
        },
        type: 'route',
    },
    register: {
        path: routePathMap.register.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return (
                import(/* webpackChunkName: 'async-register' */ '../../page/register/c-register')
                    // eslint-disable-next-line id-match
                    .then((data: {Register: React$ComponentType<*>}): React$ComponentType<*> => data.Register)
            );
        },
        type: 'route',
    },
    imageUpload: {
        path: routePathMap.imageUpload.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return (
                import(/* webpackChunkName: 'async-image-upload' */ '../../page/image/c-image-upload')
                    // eslint-disable-next-line id-match
                    .then((data: {ImageUpload: React$ComponentType<*>}): React$ComponentType<*> => data.ImageUpload)
            );
        },
        type: 'route',
    },
    imageList: {
        path: routePathMap.imageList.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return (
                import(/* webpackChunkName: 'async-image-list' */ '../../page/image/c-image-list')
                    // eslint-disable-next-line id-match
                    .then((data: {ImageList: React$ComponentType<*>}): React$ComponentType<*> => data.ImageList)
            );
        },
        type: 'route',
    },
};
