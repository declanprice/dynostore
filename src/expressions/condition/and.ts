export type AndCondition = {
    type: 'and',
}

export const and = (): AndCondition => {
    return {
        type: 'and',
    }
}