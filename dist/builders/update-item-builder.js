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
exports.UpdateItemBuilder = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const update_expression_1 = require("../expressions/update/update-expression");
const condition_expression_1 = require("../expressions/condition/condition-expression");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
class UpdateItemBuilder {
    constructor(tableName, client) {
        this.tableName = tableName;
        this.client = client;
        this.options = {};
    }
    key(key) {
        this.options.key = key;
        return this;
    }
    condition(...conditions) {
        this.options.conditionExpression = (0, condition_expression_1.createConditionExpression)('condition', ...conditions);
        return this;
    }
    update(...updates) {
        this.options.updateExpression = (0, update_expression_1.createUpdateExpression)('update', ...updates);
        return this;
    }
    return(returnValue) {
        this.options.returnValue = returnValue;
        return this;
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, updateExpression, conditionExpression, returnValue } = this.options;
            if (!key)
                throw new Error('[invalid options] - key is required');
            if (!updateExpression)
                throw new Error('[invalid options] - update expression is required');
            const result = yield this.client.send(new client_dynamodb_1.UpdateItemCommand({
                TableName: this.tableName,
                Key: (0, util_dynamodb_1.marshall)(key),
                UpdateExpression: updateExpression.expression,
                ConditionExpression: conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expression,
                ExpressionAttributeNames: Object.assign(Object.assign({}, updateExpression.expressionAttributeNames), conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expressionAttributeNames),
                ExpressionAttributeValues: Object.assign(Object.assign({}, updateExpression.expressionAttributeValues), conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expressionAttributeValues),
                ReturnValues: returnValue
            }));
            if (!result.Attributes)
                return null;
            return (0, util_dynamodb_1.unmarshall)(result.Attributes);
        });
    }
    tx() {
        const { key, updateExpression, conditionExpression, returnValue } = this.options;
        if (!key)
            throw new Error('[invalid options] - key is required');
        if (!updateExpression)
            throw new Error('[invalid options] - update expression is required');
        return {
            Update: {
                TableName: this.tableName,
                Key: (0, util_dynamodb_1.marshall)(key),
                UpdateExpression: updateExpression.expression,
                ConditionExpression: conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expression,
                ExpressionAttributeNames: Object.assign(Object.assign({}, updateExpression.expressionAttributeNames), conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expressionAttributeNames),
                ExpressionAttributeValues: Object.assign(Object.assign({}, updateExpression.expressionAttributeValues), conditionExpression === null || conditionExpression === void 0 ? void 0 : conditionExpression.expressionAttributeValues),
                ReturnValuesOnConditionCheckFailure: returnValue === 'ALL_OLD' ? 'ALL_OLD' : undefined
            }
        };
    }
}
exports.UpdateItemBuilder = UpdateItemBuilder;
