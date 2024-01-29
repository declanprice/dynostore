import {EqCondition} from "./eq";
import {GroupExpression} from "./group";
import {AttributeValue} from "@aws-sdk/client-dynamodb";
import {AndCondition} from "./and";
import {OrExpression} from "./or";
import {convertToAttr} from "@aws-sdk/util-dynamodb";
import {NotCondition} from "./not";
import {GteCondition} from "./gte";
import {GtCondition} from "./gt";
import {LtCondition} from "./lt";
import {LteCondition} from "./lte";
import {BeginsWithCondition} from "./beginsWith";
import {ExistsCondition} from "./exists";
import {NotExistsCondition} from "./notExists";
import {ContainsCondition} from "./contains";
import {NotEqCondition} from "./notEq";
import {BetweenCondition} from "./between";
import {AnyOfCondition} from "./anyOf";
import {SizeCondition} from "./size";
import {TypeCondition} from "./type";

export type KeyConditionExpression = EqCondition | LtCondition | LteCondition | GtCondition | GteCondition | BeginsWithCondition | BetweenCondition;

export type ConditionExpression =  GroupExpression | AndCondition | OrExpression | NotCondition | EqCondition | NotEqCondition | GtCondition | GteCondition | LtCondition | LteCondition | BeginsWithCondition | BetweenCondition | ExistsCondition | NotExistsCondition | ContainsCondition | AnyOfCondition | SizeCondition | TypeCondition;

export type Expression = {
    expression: string
    expressionAttributeNames: { [key: string]: string }
    expressionAttributeValues: { [key: string]: AttributeValue }
}

export const convertToExpression = (...conditions: ConditionExpression[]): Expression => {
    let expression = '';
    let expressionAttributeNames: { [key: string]: string } = {};
    let expressionAttributeValues: {[key: string]: AttributeValue } = {};
    let expressionCounter = 0;


    const applyCondition = (condition: ConditionExpression) => {
        switch (condition.type) {
            case 'group':
                expression += `(`
                for (const groupCondition of condition.conditions) {
                    applyCondition(groupCondition)
                }
                expression += `)`
                break;
            case 'or':
                expression += ` or `
                break;
            case 'and':
                expression += ` and `
                break;
            case 'not':
                expression += ` not `
                applyCondition(condition.condition)
                break;
            case 'eq':
                const eqName = `#${expressionCounter}`;
                expressionCounter++;
                const eqValue = `:${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[eqName] = condition.path;
                expressionAttributeValues[eqValue] = convertToAttr(condition.value)
                expression += `${eqName} = ${eqValue}`;
                break;
            case 'notEq':
                const notEqName = `#${expressionCounter}`;
                expressionCounter++;
                const notEqValue = `:${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[notEqName] = condition.path;
                expressionAttributeValues[notEqValue] = convertToAttr(condition.value)
                expression += `${notEqName} <> ${notEqValue}`;
                break;
            case 'gt':
                const gtName = `#${expressionCounter}`;
                expressionCounter++;
                const gtValue = `:${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[gtName] = condition.path;
                expressionAttributeValues[gtValue] = convertToAttr(condition.value)
                expression += `${gtName} > ${gtValue}`;
                break;
            case 'gte':
                const gteName = `#${expressionCounter}`;
                expressionCounter++;
                const gteValue = `:${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[gteName] = condition.path;
                expressionAttributeValues[gteValue] = convertToAttr(condition.value)
                expression += `${gteName} >= ${gteValue}`;
                break;
            case 'lt':
                const ltName = `#${expressionCounter}`;
                expressionCounter++;
                const ltValue = `:${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[ltName] = condition.path;
                expressionAttributeValues[ltValue] = convertToAttr(condition.value)
                expression += `${ltName} < ${ltValue}`;
                break;
            case 'lte':
                const lteName = `#${expressionCounter}`;
                expressionCounter++;
                const lteValue = `:${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[lteName] = condition.path;
                expressionAttributeValues[lteValue] = convertToAttr(condition.value)
                expression += `${lteName} <= ${lteValue}`;
                break;
            case 'beginsWith':
                const bwName = `#${expressionCounter}`;
                expressionCounter++;
                const bwValue = `:${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[bwName] = condition.path;
                expressionAttributeValues[bwValue] = convertToAttr(condition.value)
                expression += `begins_with(${bwName}, ${bwValue})`;
                break;
            case 'between':
                const betweenName = `#${expressionCounter}`;
                expressionCounter++;
                const betweenOneValue = `:${expressionCounter}`;
                expressionCounter++
                const betweenTwoValue = `:${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[betweenName] = condition.path;
                expressionAttributeValues[betweenOneValue] = convertToAttr(condition.valueOne)
                expressionAttributeValues[betweenTwoValue] = convertToAttr(condition.valueTwo)
                expression += `${betweenName} between ${betweenOneValue} and ${betweenTwoValue}`;
                break;
            case 'exists':
                const existsName = `#${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[existsName] = condition.path;
                expression += `attribute_exists(${existsName})`;
                break;
            case 'notExists':
                const notExistsName = `#${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[notExistsName] = condition.path;
                expression += `attribute_not_exists(${notExistsName})`;
                break;
            case 'contains':
                const containsName = `#${expressionCounter}`;
                expressionCounter++;
                const containsValue = `:${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[containsName] = condition.path;
                expressionAttributeValues[containsValue] = convertToAttr(condition.value)
                expression += `contains(${containsName}, ${containsValue})`;
                break;
            case 'anyOf':
                const anyOfName = `#${expressionCounter}`;
                expressionCounter++;
                const anyOfValues: string[] = []
                expressionAttributeNames[anyOfName] = condition.path;

                for (const value of condition.values) {
                    const anyOfValue = `:${expressionCounter}`;
                    expressionAttributeValues[anyOfValue] = convertToAttr(value)
                    anyOfValues.push(anyOfValue)
                    expressionCounter++;
                }

                expression += `${anyOfName} in (${anyOfValues.join(',')})`

                break;
            case 'type':
                const typeName = `#${expressionCounter}`;
                expressionCounter++;
                const typeValue = `:${expressionCounter}`;
                expressionCounter++;
                expressionAttributeNames[typeName] = condition.path;
                expressionAttributeValues[typeValue] = convertToAttr(condition.value)
                expression += `attribute_type(${typeName}, ${typeValue})`;
                break;
            case 'size':
                const sizeName = `#${expressionCounter}`;
                expressionCounter++
                expressionAttributeNames[sizeName] = condition.path;
                expression += `size(${sizeName})`;
                break;
            default:
                break;
        }
    }

    for (const condition of conditions) {
        applyCondition(condition);
    }

    return {
        expression: expression.trim(),
        expressionAttributeNames,
        expressionAttributeValues
    }
}