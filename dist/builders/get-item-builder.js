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
exports.GetItemBuilder = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
class GetItemBuilder {
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
    consistent(consistent) {
        this.options.consistent = consistent;
        return this;
    }
    project(projection) {
        this.options.projection = projection;
        return this;
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, consistent, projection } = this.options;
            if (!key)
                throw new Error('[invalid options] - key is missing');
            const response = yield this.client.send(new client_dynamodb_1.GetItemCommand({
                TableName: this.tableName,
                Key: (0, util_dynamodb_1.marshall)(key),
                ConsistentRead: consistent,
                ProjectionExpression: projection
            }));
            if (!response.Item)
                return null;
            return (0, util_dynamodb_1.unmarshall)(response.Item);
        });
    }
    tx() {
        const { key, projection } = this.options;
        if (!key)
            throw new Error('[invalid options] - key is missing');
        return {
            Get: {
                TableName: this.tableName,
                Key: (0, util_dynamodb_1.marshall)(key),
                ProjectionExpression: projection
            }
        };
    }
}
exports.GetItemBuilder = GetItemBuilder;
