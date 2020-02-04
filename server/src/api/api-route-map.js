// @flow

export const documentApiRouteMap = {
    getDocumentList: '/api/get-document-list',
    getDocumentSlugList: '/api/get-document-slug-list',
    // getDocumentTree: '/api/get-document-tree',
    getDocumentListSize: '/api/get-document-list-size',
    createDocument: '/api/create-document',
    updateDocument: '/api/update-document',
    uploadDocumentAsJson: '/api/upload-document-as-json',
    documentSearchExact: '/api/document-search-exact',
    documentSearch: '/api/document-search',
    documentShortDataSearch: '/api/document-short-data-search',
    getParentList: '/api/get-parent-list',
    getOrphanList: '/api/get-orphan-list',
    removeDocument: '/api/remove-document',
    getDocumentSlugHeaderList: '/api/get-document-slug-header-list',
};

export const pdfApiRouteMap = {
    // getImageAsPdf: '/api/get-image-as-pdf',
};

export const userApiRouteMap = {
    getUserList: '/api/get-user-list',
    getUserListSize: '/api/get-user-list-size',
    register: '/api/register',
    login: '/api/login',
    unLogin: '/api/un-login',
    getCurrentUser: '/api/get-current-user',
};

export const fileApiRouteMap = {
    uploadFileList: '/api/upload-file-list',
    getFileList: '/api/get-file-list',
    getFileListWithoutParent: '/api/get-file-list-without-parent',
    getResizedImage: '/api/get-resized-image',
};

export const initialDataApiRouteMap = {
    getInitialData: '/api/get-initial-data',
};
