export type AndExpression = {
    type: 'and',
}

export const and = (): AndExpression => {
    return {
        type: 'and',
    }
}