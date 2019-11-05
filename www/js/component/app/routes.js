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
import {routePathMap} from './routes-path-map';

export const routeItemMap: {[key: string]: RouteItemType | RedirectItemType} = {
    home: {
        path: routePathMap.home.path,
        component: Home,
        type: 'route',
    },
    userList: {
        path: routePathMap.userList.path,
        component: UserList,
        type: 'route',
    },
    documentList: {
        path: routePathMap.documentList.path,
        component: DocumentList,
        type: 'route',
    },
    documentCreate: {
        path: routePathMap.documentCreate.path,
        component: DocumentCreate,
        type: 'route',
    },
    documentEdit: {
        path: routePathMap.documentEdit.path,
        staticPartPath: routePathMap.documentEdit.staticPartPath,
        component: DocumentEdit,
        type: 'route',
    },
    login: {
        path: routePathMap.login.path,
        component: Login,
        type: 'route',
    },
    register: {
        path: routePathMap.register.path,
        component: Register,
        type: 'route',
    },
    aboutUs: {
        path: routePathMap.aboutUs.path,
        component: AboutUs,
        type: 'route',
    },
    contact: {
        path: routePathMap.contact.path,
        component: Contact,
        type: 'route',
    },
};
