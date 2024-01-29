export type EqExpression = {
    type: 'eq',
    name: string;
    value: string
}

export const eq = (name: string, value: string): EqExpression => {
    return {
        type: 'eq',
        name,
        value
    }
}