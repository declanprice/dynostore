export type OrExpression = {
    type: 'or',
}

export const or = (): OrExpression => {
    return {
        type: 'or',
    }
}