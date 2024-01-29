export type BeginsWithCondition = {
    type: 'beginsWith',
    path: string,
    value: string
}

export const beginsWith = (path: string, value: string): BeginsWithCondition => {
    return {
        type: 'beginsWith',
        path,
        value
    }
}