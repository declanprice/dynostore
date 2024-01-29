import {NativeAttributeValue} from "@aws-sdk/util-dynamodb";

export type BetweenCondition = {
    type: 'between',
    path: string,
    valueOne: NativeAttributeValue
    valueTwo: NativeAttributeValue
}

export const between = (path: string, valueOne: NativeAttributeValue, valueTwo:NativeAttributeValue ): BetweenCondition => {
    return {
        type: 'between',
        path,
        valueOne,
        valueTwo
    }
}