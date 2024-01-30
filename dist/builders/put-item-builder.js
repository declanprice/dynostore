"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PutItemBuilder = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const condition_expression_1 = require("../expressions/condition/condition-expression");
class PutItemBuilder {
    constructor(tableName, client) {
        this.tableName = tableName;
        this.client = client;
        this.options = {};
    }
    item(item) {
        this.options.item = item;
        return this;
    }
    condition(...conditions) {
        this.options.conditionExpression = (0, condition_expression_1.createConditionExpression)('condition', ...conditions);
        return this;
    }
    returnOld() {
        this.options.returnOld = true;
        return this;
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            const { item, conditionExpression, returnOld } = this.options;
            if (!item)
                throw new Error('[invalid options] - item is missing');
            const result = yield this.client.send(new client_dynamodb_1.PutItemCommand({
                TableName: this.tableName,
                Item: (0, util_dynamodb_1.marshall)(item),
                ConditionExpression: conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expression,
                ExpressionAttributeNames: conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expressionAttributeNames,
                ExpressionAttributeValues: conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expressionAttributeValues,
                ReturnValues: returnOld === true ? 'ALL_OLD' : 'NONE'
            }));
            if (!(result === null || result === void 0 ? void 0 : result.Attributes))
                return null;
            return (0, util_dynamodb_1.unmarshall)(result.Attributes);
        });
    }
    tx() {
        const { item, conditionExpression, returnOld } = this.options;
        if (!item)
            throw new Error('[invalid options] - item is missing');
        return {
            Put: {
                TableName: this.tableName,
                Item: (0, util_dynamodb_1.marshall)(item),
                ConditionExpression: conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expression,
                ExpressionAttributeNames: conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expressionAttributeNames,
                ExpressionAttributeValues: conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expressionAttributeValues,
                ReturnValuesOnConditionCheckFailure: returnOld === true ? 'ALL_OLD' : 'NONE'
            }
        };
    }
}
exports.PutItemBuilder = PutItemBuilder;
