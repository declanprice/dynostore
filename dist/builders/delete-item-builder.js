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
exports.DeleteItemBuilder = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const condition_expression_1 = require("../expressions/condition/condition-expression");
class DeleteItemBuilder {
    constructor(tableName, client, defaults = {}) {
        this.tableName = tableName;
        this.client = client;
        this.defaults = defaults;
        this.options = Object.assign({}, defaults);
    }
    key(key) {
        this.options.key = key;
        return this;
    }
    condition(...conditions) {
        this.options.condition = (0, condition_expression_1.createConditionExpression)('condition', ...conditions);
        return this;
    }
    returnOld() {
        this.options.returnOld = true;
        return this;
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, condition, returnOld } = this.options;
            if (!key)
                throw new Error('[invalid options] - key is missing');
            const result = yield this.client.send(new client_dynamodb_1.DeleteItemCommand({
                TableName: this.tableName,
                Key: (0, util_dynamodb_1.marshall)(key),
                ConditionExpression: condition === null || condition === void 0 ? void 0 : condition.expression,
                ExpressionAttributeNames: condition === null || condition === void 0 ? void 0 : condition.expressionAttributeNames,
                ExpressionAttributeValues: condition === null || condition === void 0 ? void 0 : condition.expressionAttributeValues,
                ReturnValues: returnOld ? 'ALL_OLD' : 'NONE',
                ReturnValuesOnConditionCheckFailure: returnOld ? 'ALL_OLD' : 'NONE'
            }));
            if (!(result === null || result === void 0 ? void 0 : result.Attributes))
                return null;
            return (0, util_dynamodb_1.unmarshall)(result.Attributes);
        });
    }
    tx() {
        const { key, condition, returnOld } = this.options;
        if (!key)
            throw new Error('[invalid options] - key is missing');
        return {
            Delete: {
                TableName: this.tableName,
                Key: (0, util_dynamodb_1.marshall)(key),
                ConditionExpression: condition === null || condition === void 0 ? void 0 : condition.expression,
                ExpressionAttributeNames: condition === null || condition === void 0 ? void 0 : condition.expressionAttributeNames,
                ExpressionAttributeValues: condition === null || condition === void 0 ? void 0 : condition.expressionAttributeValues,
                ReturnValuesOnConditionCheckFailure: returnOld ? 'ALL_OLD' : 'NONE'
            }
        };
    }
}
exports.DeleteItemBuilder = DeleteItemBuilder;
