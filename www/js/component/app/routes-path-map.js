// @flow

export const routePathMap = {
    siteEnter: {
        path: '/',
    },
    article: {
        path: '/article/:slug',
        staticPartPath: '/article',
    },

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
    fileUpload: {
        path: '/cms/file-upload',
    },
    fileList: {
        path: '/cms/file-list',
    },
};
