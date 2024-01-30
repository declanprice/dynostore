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
exports.ScanItemsBuilder = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const condition_expression_1 = require("../expressions/condition/condition-expression");
class ScanItemsBuilder {
    constructor(tableName, client) {
        this.tableName = tableName;
        this.client = client;
        this.options = {};
    }
    using(indexName) {
        this.options.indexName = indexName;
        return this;
    }
    filter(...conditions) {
        this.options.filter = (0, condition_expression_1.createConditionExpression)('filter', ...conditions);
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
    consistent() {
        this.options.consistent = true;
        return this;
    }
    parallel(totalSegments, segment) {
        this.options.parallel = {
            totalSegments,
            segment
        };
        return this;
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            const { indexName, consistent, projection, filter, limit, startAt, parallel } = this.options;
            const response = yield this.client.send(new client_dynamodb_1.ScanCommand({
                TableName: this.tableName,
                IndexName: indexName,
                ConsistentRead: consistent,
                ProjectionExpression: projection,
                FilterExpression: filter === null || filter === void 0 ? void 0 : filter.expression,
                ExpressionAttributeNames: Object.assign({}, filter === null || filter === void 0 ? void 0 : filter.expressionAttributeNames),
                ExpressionAttributeValues: Object.assign({}, filter === null || filter === void 0 ? void 0 : filter.expressionAttributeValues),
                Limit: limit,
                ExclusiveStartKey: (0, util_dynamodb_1.marshall)(startAt),
                TotalSegments: parallel === null || parallel === void 0 ? void 0 : parallel.totalSegments,
                Segment: parallel === null || parallel === void 0 ? void 0 : parallel.segment
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
exports.ScanItemsBuilder = ScanItemsBuilder;
