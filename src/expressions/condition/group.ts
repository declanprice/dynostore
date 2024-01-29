import {ConditionExpression} from "./condition-expression";

export type GroupExpression = {
    type: 'group',
    expressions: ConditionExpression[];
}

export const group = (expressions: ConditionExpression[]): GroupExpression => {
    return {
        type: 'group',
        expressions
    }
}