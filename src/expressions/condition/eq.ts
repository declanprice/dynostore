import {NativeAttributeValue} from "@aws-sdk/util-dynamodb";

export type EqCondition = {
    type: 'eq',
    path: string;
    value: NativeAttributeValue,
}

export const eq = (path: string, value: NativeAttributeValue): EqCondition => {
    return {
        type: 'eq',
        path,
        value
    }
}