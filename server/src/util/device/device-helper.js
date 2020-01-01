// @flow

import type {DeviceDataType} from './device-type';
import {mobileDeviceList, supportedDeviceList} from './device-const';

export function isMobileDevice(device: DeviceDataType): boolean {
    return mobileDeviceList.includes(device.type);
}

export function isSupportedDevice(device: DeviceDataType): boolean {
    return supportedDeviceList.includes(device.type);
}
