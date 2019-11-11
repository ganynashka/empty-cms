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
    documentTree: {
        path: '/document-tree',
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
    imageUpload: {
        path: '/image-upload',
    },
    imageList: {
        path: '/image-list',
    },
};
