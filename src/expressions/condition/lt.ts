import {NativeAttributeValue} from "@aws-sdk/util-dynamodb";

export type LtCondition = {
    type: 'lt',
    path: string;
    value: NativeAttributeValue,
}

export const lt = (path: string, value: NativeAttributeValue): LtCondition => {
    return {
        type: 'lt',
        path,
        value
    }
}