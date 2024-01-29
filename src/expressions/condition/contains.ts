export type ContainsExpression = {
    type: 'contains',
    path,
    value
}

export const contains = (path: string, value: string): ContainsExpression => {
    return {
        type: 'contains',
        path,
        value
    }
}