// @flow

import type {MongoUserFrontType} from '../../../../server/src/database/database-type';
import {mongoUserRoleMap} from '../../../../server/src/database/database-const';
import type {MainServerApiResponseType} from '../../type/response';

export const defaultUserFrontState: MongoUserFrontType = {
    role: mongoUserRoleMap.user,
    login: '',
    registerDate: 0,
    rating: 0,
};

export const defaultUserContextData = {
    user: defaultUserFrontState,
    login: (userLogin: string, userPassword: string): Promise<MongoUserFrontType | Error> =>
        Promise.resolve(defaultUserFrontState),
    register: (userLogin: string, userPassword: string): Promise<MainServerApiResponseType | Error> =>
        Promise.resolve(new Error('You should override this method')),
};
