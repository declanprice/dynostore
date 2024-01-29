import {EqCondition} from "./eq";

export type NotCondition = {
    type: 'not',
    condition: EqCondition
}

export const not = (condition: EqCondition): NotCondition => {
    return {
        type: 'not',
        condition
    }
}