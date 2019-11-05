// @flow

export type MainServerApiResponseType = {|
    +isSuccessful: boolean,
    +errorList: Array<string>,
    +data?: mixed,
|};
