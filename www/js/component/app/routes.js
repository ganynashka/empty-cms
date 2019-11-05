// @flow

import {Home} from '../../page/home/c-home';
import {Login} from '../../page/login/c-login';
import {AboutUs} from '../../page/about-us/c-about-us';
import {Contact} from '../../page/contact/c-contact';
import {Register} from '../../page/register/c-register';
import {UserList} from '../../page/user/c-user-list';
import {DocumentList} from '../../page/document/c-document-list';
import {DocumentCreate} from '../../page/document/c-document-create';
import {DocumentEdit} from '../../page/document/c-document-edit';

import type {RedirectItemType, RouteItemType} from './render-route-helper';

export const routeItemMap: {[key: string]: RouteItemType | RedirectItemType} = {
    home: {
        path: '/',
        component: Home,
        type: 'route',
    },
    userList: {
        path: '/user-list',
        component: UserList,
        type: 'route',
    },
    documentList: {
        path: '/document-list',
        component: DocumentList,
        type: 'route',
    },
    documentCreate: {
        path: '/document-create',
        component: DocumentCreate,
        type: 'route',
    },
    documentEdit: {
        path: '/document-edit/:slug',
        staticPartPath: '/document-edit',
        component: DocumentEdit,
        type: 'route',
    },
    login: {
        path: '/login',
        component: Login,
        type: 'route',
    },
    register: {
        path: '/register',
        component: Register,
        type: 'route',
    },
    aboutUs: {
        path: '/about-us',
        component: AboutUs,
        type: 'route',
    },
    contact: {
        path: '/contact',
        component: Contact,
        type: 'route',
    },
};
