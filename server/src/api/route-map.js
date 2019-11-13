// @flow

export const documentApiRouteMap = {
    getDocumentList: '/api/get-document-list',
    getDocumentListSize: '/api/get-document-list-size',
    createDocument: '/api/create-document',
    updateDocument: '/api/update-document',
    documentSearchExact: '/api/document-search-exact',
    getParentList: '/api/get-parent-list',
    getOrphanList: '/api/get-orphan-list',
};

export const userApiRouteMap = {
    getUserList: '/api/get-user-list',
    getUserListSize: '/api/get-user-list-size',
    register: '/api/register',
    login: '/api/login',
};

export const fileApiRouteMap = {
    uploadImageList: '/api/upload-image-list',
    getFileList: '/api/get-file-list',
    getResizedImage: '/api/get-resized-image',
};
