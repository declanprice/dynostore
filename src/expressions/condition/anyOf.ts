import {NativeAttributeValue} from "@aws-sdk/util-dynamodb";

export type AnyOfCondition = {
    type: 'anyOf',
    path: string,
    values: NativeAttributeValue[]
}

export const anyOf = (path: string, values: NativeAttributeValue[]): AnyOfCondition => {
    return {
        type: 'anyOf',
        path,
        values
    }
}