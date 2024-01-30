"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdateExpression = void 0;
const expression_attributes_1 = require("../expression-attributes");
const createUpdateExpression = (name, ...updates) => {
    const attributes = new expression_attributes_1.ExpressionAttributes(name);
    let expressions = [];
    for (const update of updates) {
        switch (update.type) {
            case 'set':
                const setName = attributes.addName(update.path);
                const setValue = attributes.addValue(update.value);
                expressions.push(`SET ${setName} = ${setValue}`);
                break;
            case 'setIfNotExists':
                const ifNotExistsName = attributes.addName(update.path);
                const ifNotExistsValue = attributes.addValue(update.value);
                expressions.push(`SET ${ifNotExistsName} if_not_exists(${ifNotExistsName}, ${ifNotExistsValue})`);
                break;
            case 'increment':
                const incrementName = attributes.addName(update.path);
                const incrementValue = attributes.addValue(update.value);
                expressions.push(`SET ${incrementName} + ${incrementValue}`);
                break;
            case 'decrement':
                const decrementName = attributes.addName(update.path);
                const decrementValue = attributes.addValue(update.value);
                expressions.push(`SET ${decrementName} - ${decrementValue}`);
                break;
            case 'remove':
                const removeName = attributes.addName(update.path);
                expressions.push(`REMOVE ${removeName} `);
                break;
            case 'add':
                const addName = attributes.addName(update.path);
                const addValue = attributes.addValue(update.value);
                expressions.push(`ADD ${addName} ${addValue}`);
                break;
            case 'delete':
                const deleteName = attributes.addName(update.path);
                const deleteValue = attributes.addValue(update.value);
                expressions.push(`DELETE ${deleteName} ${deleteValue}`);
                break;
            default:
                break;
        }
    }
    return {
        expression: expressions.join(',').trim(),
        expressionAttributeNames: attributes.expressionAttributeNames,
        expressionAttributeValues: attributes.expressionAttributeValues
    };
};
exports.createUpdateExpression = createUpdateExpression;
