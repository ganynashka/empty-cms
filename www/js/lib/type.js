// @flow

// How to use
// 1 - define a type
// > type CheckType = { prop1: SomeType, prop2: OtherType };
// 2 - next line throw error in runtime if type is wrong
// > const checkedFormData: CheckType = typeConverter<CheckType>(formData);

export function typeConverter<NeededType>(someObject: mixed): NeededType {
    // $FlowFixMe
    return someObject;
}

export type NullableType<SomeType> = SomeType | null;
