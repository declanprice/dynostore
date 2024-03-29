import {NativeAttributeValue} from "@aws-sdk/util-dynamodb";

export type GtCondition = {
    type: 'gt',
    path: string;
    value: NativeAttributeValue,
}

export const gt = (path: string, value: NativeAttributeValue): GtCondition => {
    return {
        type: 'gt',
        path,
        value
    }
}