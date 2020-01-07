// @flow

export const dataBaseConst = {
    url: 'mongodb://localhost:27001,localhost:27002,localhost:27003,localhost:27004?replicaSet=MyBestReplica',
    shallCommand: {
        backup: 'mongodump --port=27001 --archive=db-dump/db-dump-`date +%Y-%m-%d-%H-%M-%S`.zip',
    },
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
