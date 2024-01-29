export type TypeCondition = {
    type: 'type',
    path: string;
    value: string
}

export const type = (path: string, value: string): TypeCondition => {
    return {
        type: 'type',
        path,
        value
    }
}