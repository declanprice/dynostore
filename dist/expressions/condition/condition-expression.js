"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConditionExpression = void 0;
const expression_attributes_1 = require("../expression-attributes");
const createConditionExpression = (name, ...conditions) => {
    let expression = '';
    let expressionAttributes = new expression_attributes_1.ExpressionAttributes(name);
    const applyCondition = (condition) => {
        switch (condition.type) {
            case 'group':
                expression += `(`;
                for (const groupCondition of condition.conditions) {
                    applyCondition(groupCondition);
                }
                expression += `)`;
                break;
            case 'or':
                expression += ` or `;
                break;
            case 'and':
                expression += ` and `;
                break;
            case 'not':
                expression += ` not `;
                applyCondition(condition.condition);
                break;
            case 'eq':
                const eqName = expressionAttributes.addName(condition.path);
                const eqValue = expressionAttributes.addValue(condition.value);
                expression += `${eqName} = ${eqValue}`;
                break;
            case 'notEq':
                const notEqName = expressionAttributes.addName(condition.path);
                const notEqValue = expressionAttributes.addValue(condition.value);
                expression += `${notEqName} <> ${notEqValue}`;
                break;
            case 'gt':
                const gtName = expressionAttributes.addName(condition.path);
                const gtValue = expressionAttributes.addValue(condition.value);
                expression += `${gtName} > ${gtValue}`;
                break;
            case 'gte':
                const gteName = expressionAttributes.addName(condition.path);
                const gteValue = expressionAttributes.addValue(condition.value);
                expression += `${gteName} >= ${gteValue}`;
                break;
            case 'lt':
                const ltName = expressionAttributes.addName(condition.path);
                const ltValue = expressionAttributes.addValue(condition.value);
                expression += `${ltName} < ${ltValue}`;
                break;
            case 'lte':
                const lteName = expressionAttributes.addName(condition.path);
                const lteValue = expressionAttributes.addValue(condition.value);
                expression += `${lteName} <= ${lteValue}`;
                break;
            case 'beginsWith':
                const bwName = expressionAttributes.addName(condition.path);
                const bwValue = expressionAttributes.addValue(condition.value);
                expression += `begins_with(${bwName}, ${bwValue})`;
                break;
            case 'between':
                const betweenName = expressionAttributes.addName(condition.path);
                const betweenOneValue = expressionAttributes.addValue(condition.valueOne);
                const betweenTwoValue = expressionAttributes.addValue(condition.valueTwo);
                expression += `${betweenName} between ${betweenOneValue} and ${betweenTwoValue}`;
                break;
            case 'exists':
                const existsName = expressionAttributes.addName(condition.path);
                expression += `attribute_exists(${existsName})`;
                break;
            case 'notExists':
                const notExistsName = expressionAttributes.addName(condition.path);
                expression += `attribute_not_exists(${notExistsName})`;
                break;
            case 'contains':
                const containsName = expressionAttributes.addName(condition.path);
                const containsValue = expressionAttributes.addValue(condition.value);
                expression += `contains(${containsName}, ${containsValue})`;
                break;
            case 'anyOf':
                const anyOfName = expressionAttributes.addName(condition.path);
                const anyOfValues = [];
                for (const value of condition.values) {
                    const anyOfValue = expressionAttributes.addValue(value);
                    anyOfValues.push(anyOfValue);
                }
                expression += `${anyOfName} in (${anyOfValues.join(',')})`;
                break;
            case 'type':
                const typeName = expressionAttributes.addName(condition.path);
                const typeValue = expressionAttributes.addValue(condition.value);
                expression += `attribute_type(${typeName}, ${typeValue})`;
                break;
            case 'size':
                const sizeName = expressionAttributes.addName(condition.path);
                expression += `size(${sizeName})`;
                break;
            default:
                break;
        }
    };
    for (const condition of conditions) {
        applyCondition(condition);
    }
    return {
        expression: expression.trim(),
        expressionAttributeNames: expressionAttributes.expressionAttributeNames,
        expressionAttributeValues: expressionAttributes.expressionAttributeValues
    };
};
exports.createConditionExpression = createConditionExpression;
