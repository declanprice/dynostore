export type ContainsCondition = {
    type: 'contains',
    path: string,
    value: string
}

export const contains = (path: string, value: string): ContainsCondition => {
    return {
        type: 'contains',
        path,
        value
    }
}