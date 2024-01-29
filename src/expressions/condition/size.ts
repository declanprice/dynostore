export type SizeCondition = {
    type: 'size',
    path: string;
}

export const size = (path: string): SizeCondition => {
    return {
        type: 'size',
        path,
    }
}