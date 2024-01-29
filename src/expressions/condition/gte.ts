import {NativeAttributeValue} from "@aws-sdk/util-dynamodb";

export type GteCondition = {
    type: 'gte',
    path: string;
    value: NativeAttributeValue,
}

export const gte = (path: string, value: NativeAttributeValue): GteCondition => {
    return {
        type: 'gte',
        path,
        value
    }
}