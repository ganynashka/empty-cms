// @flow

import type {MongoUserFrontType} from '../../../../server/src/db/type';

export type UserContextConsumerType = {|
    +user: MongoUserFrontType,
|};
