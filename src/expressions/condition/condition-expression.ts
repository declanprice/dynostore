import {EqExpression} from "./eq";
import {GroupExpression} from "./group";

export type KeyConditionExpression = EqExpression;

export type FilterConditionExpression = EqExpression;

export type PutConditionExpression =  EqExpression | GroupExpression;

export const convertToExpression = () => {
}