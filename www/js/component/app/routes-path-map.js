// @flow

export const routePathMap = {
    home: {
        path: '/',
    },
    userList: {
        path: '/user-list',
    },
    documentList: {
        path: '/document-list',
    },
    documentCreate: {
        path: '/document-create',
    },
    documentEdit: {
        path: '/document-edit/:slug',
        staticPartPath: '/document-edit',
    },
    login: {
        path: '/login',
    },
    register: {
        path: '/register',
    },
    aboutUs: {
        path: '/about-us',
    },
    contact: {
        path: '/contact',
    },
};
