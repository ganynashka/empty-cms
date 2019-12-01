// @flow

import {Home} from '../../page/client/home/c-home';
import {Article} from '../../page/client/article/c-article';

import {PageNotFound} from '../../page/client/page-not-found/c-page-not-found';

import {routePathMap} from './routes-path-map';

export const routeItemPage404 = {
    path: '*',
    component: PageNotFound,
    type: 'route',
};

export const routeItemMap = {
    // client
    siteEnter: {
        path: routePathMap.siteEnter.path,
        component: Home,
        type: 'route',
    },
    article: {
        path: routePathMap.article.path,
        component: Article,
        type: 'route',
    },

    // cms
    cmsEnter: {
        path: routePathMap.cmsEnter.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return (
                import(/* webpackChunkName: 'async-user-cms-home' */ '../../page/cms/home/c-home')
                    // eslint-disable-next-line id-match
                    .then((data: {Home: React$ComponentType<*>}): React$ComponentType<*> => data.Home)
            );
        },
        type: 'route',
    },
    userList: {
        path: routePathMap.userList.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return (
                import(/* webpackChunkName: 'async-user-list' */ '../../page/cms/user/c-user-list')
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
                import(/* webpackChunkName: 'async-document-list' */ '../../page/cms/document/c-document-list')
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
                /* webpackChunkName: 'async-document-tree-view' */ '../../page/cms/document/c-document-tree-view'
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
            return import(
                /* webpackChunkName: 'async-document-create' */ '../../page/cms/document/c-document-create'
            ).then(
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
                import(/* webpackChunkName: 'async-document-edit' */ '../../page/cms/document/c-document-edit')
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
                import(/* webpackChunkName: 'async-login' */ '../../page/cms/login/c-login')
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
                import(/* webpackChunkName: 'async-register' */ '../../page/cms/register/c-register')
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
                import(/* webpackChunkName: 'async-image-upload' */ '../../page/cms/image/c-image-upload')
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
                import(/* webpackChunkName: 'async-image-list' */ '../../page/cms/image/c-image-list')
                    // eslint-disable-next-line id-match
                    .then((data: {ImageList: React$ComponentType<*>}): React$ComponentType<*> => data.ImageList)
            );
        },
        type: 'route',
    },
};
