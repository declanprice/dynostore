export type NotExistsCondition = {
    type: 'notExists',
    path: string,
}

export const notExists = (path: string): NotExistsCondition => {
    return {
        type: 'notExists',
        path,
    }
}