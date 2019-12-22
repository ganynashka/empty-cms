// @flow

import {Home} from '../../page/client/home/c-home';
import {Article} from '../../page/client/article/c-article';
import {PageNotFound} from '../../page/client/page-not-found/c-page-not-found';
import {PageWrapper} from '../page-wrapper/c-page-wrapper';

import {routePathMap} from './routes-path-map';
import {starPath} from './render-route/render-route-const';

export const routeItemPage404 = {
    path: starPath,
    component: PageNotFound,
    type: 'route',
    id: 'page-404',
    pageWrapper: PageWrapper,
};

export const routeItemMap = {
    // client
    siteEnter: {
        path: routePathMap.siteEnter.path,
        component: Home,
        type: 'route',
        pageWrapper: PageWrapper,
    },
    article: {
        path: routePathMap.article.path,
        component: Article,
        type: 'route',
        pageWrapper: PageWrapper,
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
        pageWrapper: PageWrapper,
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
        pageWrapper: PageWrapper,
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
        pageWrapper: PageWrapper,
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
        pageWrapper: PageWrapper,
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
        pageWrapper: PageWrapper,
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
        pageWrapper: PageWrapper,
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
        pageWrapper: PageWrapper,
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
        pageWrapper: PageWrapper,
    },
    fileUpload: {
        path: routePathMap.fileUpload.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return (
                import(/* webpackChunkName: 'async-file-upload' */ '../../page/cms/file/c-file-upload')
                    // eslint-disable-next-line id-match
                    .then((data: {FileUpload: React$ComponentType<*>}): React$ComponentType<*> => data.FileUpload)
            );
        },
        type: 'route',
        pageWrapper: PageWrapper,
    },
    fileList: {
        path: routePathMap.fileList.path,
        component: (): null => null,
        // eslint-disable-next-line id-match
        asyncLoad: (): Promise<React$ComponentType<*>> => {
            return (
                import(/* webpackChunkName: 'async-file-list' */ '../../page/cms/file/c-file-list')
                    // eslint-disable-next-line id-match
                    .then((data: {FileList: React$ComponentType<*>}): React$ComponentType<*> => data.FileList)
            );
        },
        type: 'route',
        pageWrapper: PageWrapper,
    },
};
