// @flow

import type {MongoUserFrontType} from '../../../../server/src/db/type';
import type {MainServerApiResponseType} from '../../type/response';

export type UserContextConsumerType = {|
    +user: MongoUserFrontType,
    +login: (login: string, password: string) => Promise<MongoUserFrontType | Error>,
    +register: (login: string, password: string) => Promise<MainServerApiResponseType | Error>,
|};
