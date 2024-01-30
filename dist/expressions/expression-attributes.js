"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionAttributes = void 0;
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
class ExpressionAttributes {
    constructor(expressionName) {
        this.expressionName = expressionName;
        this.expressionAttributeNames = {};
        this.expressionAttributeValues = {};
        this.expressionCounter = 0;
    }
    addName(name) {
        const exName = `#${this.expressionName}-${this.expressionCounter}`;
        this.expressionAttributeNames[exName] = name;
        this.expressionCounter++;
        return exName;
    }
    addValue(value) {
        const exValue = `:${this.expressionName}-${this.expressionCounter}`;
        this.expressionAttributeValues[exValue] = (0, util_dynamodb_1.convertToAttr)(value);
        this.expressionCounter++;
        return exValue;
    }
}
exports.ExpressionAttributes = ExpressionAttributes;
