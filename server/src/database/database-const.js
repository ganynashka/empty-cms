// @flow

export const dataBaseConst = {
    url: 'mongodb://localhost:27001,localhost:27002,localhost:27003,localhost:27004?replicaSet=MyBestReplica',
    name: 'main-db',
    collection: {
        user: 'user',
        document: 'document',
    },
};

export const mongoUserRoleMap = {
    user: 'user',
    admin: 'admin',
};
