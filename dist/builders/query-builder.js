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
exports.QueryItemsBuilder = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const convert_condition_expression_1 = require("../expressions/condition/convert-condition-expression");
class QueryItemsBuilder {
    constructor(tableName, client) {
        this.tableName = tableName;
        this.client = client;
        this.options = {};
    }
    pk(path, value) {
        this.options.pk = {
            path,
            value
        };
    }
    sk(path, condition) {
        this.options.sk = {
            path,
            condition: (0, convert_condition_expression_1.convertToExpression)('key', condition)
        };
    }
    filter(...conditions) {
        this.options.filter = (0, convert_condition_expression_1.convertToExpression)('filter', ...conditions);
        return this;
    }
    project(projection) {
        this.options.projection = projection;
        return this;
    }
    limit(limit) {
        this.options.limit = limit;
        return this;
    }
    startAt(key) {
        this.options.startAt = key;
        return this;
    }
    sort(dir) {
        this.options.sort = dir;
        return this;
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            const { pk, sk, projection, filter, limit, startAt, sort } = this.options;
            if (!pk)
                throw new Error('[invalid options] - pk is missing');
            const response = yield this.client.send(new client_dynamodb_1.QueryCommand({
                TableName: this.tableName,
                IndexName: this.options.indexName,
                ProjectionExpression: projection,
                KeyConditionExpression: sk === null || sk === void 0 ? void 0 : sk.condition.expression,
                FilterExpression: filter === null || filter === void 0 ? void 0 : filter.expression,
                ExpressionAttributeNames: Object.assign(Object.assign({}, sk === null || sk === void 0 ? void 0 : sk.condition.expressionAttributeNames), filter === null || filter === void 0 ? void 0 : filter.expressionAttributeNames),
                ExpressionAttributeValues: Object.assign(Object.assign({}, sk === null || sk === void 0 ? void 0 : sk.condition.expressionAttributeValues), filter === null || filter === void 0 ? void 0 : filter.expressionAttributeValues),
                Limit: limit,
                ExclusiveStartKey: (0, util_dynamodb_1.marshall)(startAt),
                ScanIndexForward: sort !== 'desc'
            }));
            if (!response.Items) {
                return [];
            }
            return {
                items: response.Items.map((i) => (0, util_dynamodb_1.unmarshall)(i)),
                lastKey: response.LastEvaluatedKey ? (0, util_dynamodb_1.unmarshall)(response.LastEvaluatedKey) : null
            };
        });
    }
}
exports.QueryItemsBuilder = QueryItemsBuilder;
