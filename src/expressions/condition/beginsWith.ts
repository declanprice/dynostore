export type BeginsWithExpression = {
    type: 'beginsWith',
    path: string,
    value: string
}

export const beginsWith = (path: string, value: string): BeginsWithExpression => {
    return {
        type: 'beginsWith',
        path,
        value
    }
}