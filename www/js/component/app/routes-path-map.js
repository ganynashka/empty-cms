// @flow

export const routePathMap = {
    // home: {
    //     path: '/',
    // },

    // cms
    cmsEnter: {
        path: '/cms',
    },
    userList: {
        path: '/cms/user-list',
    },
    documentList: {
        path: '/cms/document-list',
    },
    documentTree: {
        path: '/cms/document-tree',
    },
    documentCreate: {
        path: '/cms/document-create',
    },
    documentEdit: {
        path: '/cms/document-edit/:slug',
        staticPartPath: '/cms/document-edit',
    },
    login: {
        path: '/cms/login',
    },
    register: {
        path: '/cms/register',
    },
    imageUpload: {
        path: '/cms/image-upload',
    },
    imageList: {
        path: '/cms/image-list',
    },
};
