// @flow

type DeviceDataTypeType = 'desktop' | 'tv' | 'tablet' | 'phone' | 'bot' | 'car';

export type DeviceDataType = {
    +type: DeviceDataTypeType,
};
