import {NativeAttributeValue} from "@aws-sdk/util-dynamodb";

export type LteCondition = {
    type: 'lte',
    path: string;
    value: NativeAttributeValue,
}

export const lte = (path: string, value: NativeAttributeValue): LteCondition => {
    return {
        type: 'lte',
        path,
        value
    }
}