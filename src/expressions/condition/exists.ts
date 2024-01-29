export type ExistsCondition = {
    type: 'exists',
    path: string,
}

export const exists = (path: string): ExistsCondition => {
    return {
        type: 'exists',
        path
    }
}