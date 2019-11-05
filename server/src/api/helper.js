// @flow

export const streamOptionsArray = {transform: (item: {}): string => JSON.stringify(item) + ','};
