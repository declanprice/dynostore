import {ConditionExpression} from "./condition-expression";

export type GroupExpression = {
    type: 'group',
    conditions: ConditionExpression[];
}

export const group = (...conditions: ConditionExpression[]): GroupExpression => {
    return {
        type: 'group',
        conditions
    }
}