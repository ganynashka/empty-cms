// @flow

import {type $Request} from 'express';

import type {DeviceDataType} from './device-type';

export function getDeviceData(request: $Request): DeviceDataType {
    // $FlowFixMe
    const device: DeviceDataType = request.device;

    return {
        type: device.type,
    };
}
