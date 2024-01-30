"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const get_item_builder_1 = require("./builders/get-item-builder");
const put_item_builder_1 = require("./builders/put-item-builder");
const query_builder_1 = require("./builders/query-builder");
const delete_item_builder_1 = require("./builders/delete-item-builder");
const update_item_builder_1 = require("./builders/update-item-builder");
const scan_items_builder_1 = require("./builders/scan-items-builder");
class Store {
    constructor(tableName, client) {
        this.tableName = tableName;
        this.client = client;
    }
    get(item) {
        return new get_item_builder_1.GetItemBuilder(this.tableName, this.client);
    }
    put() {
        return new put_item_builder_1.PutItemBuilder(this.tableName, this.client);
    }
    update() {
        return new update_item_builder_1.UpdateItemBuilder(this.tableName, this.client);
    }
    delete() {
        return new delete_item_builder_1.DeleteItemBuilder(this.tableName, this.client);
    }
    query() {
        return new query_builder_1.QueryItemsBuilder(this.tableName, this.client);
    }
    scan() {
        return new scan_items_builder_1.ScanItemsBuilder(this.tableName, this.client);
    }
}
exports.Store = Store;
