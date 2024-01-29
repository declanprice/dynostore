import {NativeAttributeValue} from "@aws-sdk/util-dynamodb";

export type NotEqCondition = {
    type: 'notEq',
    path: string;
    value: NativeAttributeValue,
}

export const notEq = (path: string, value: NativeAttributeValue): NotEqCondition => {
    return {
        type: 'notEq',
        path,
        value
    }
}