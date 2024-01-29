export type NotExpression = {
    type: 'not',
}

export const not = (): NotExpression => {
    return {
        type: 'not',
    }
}