// @flow

import type {DeviceDataType} from './device-type';
import {mobileDeviceList} from './device-const';

export function isMobileDevice(device: DeviceDataType): boolean {
    return mobileDeviceList.includes(device.type);
}
