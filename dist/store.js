"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const get_item_builder_1 = require("./builders/get-item-builder");
class Store {
    constructor(tableName, client) {
        this.tableName = tableName;
        this.client = client;
    }
    get() {
        return new get_item_builder_1.GetItemBuilder(this.tableName, this.client);
    }
    put() { }
    update() { }
    delete() { }
    query() { }
    scan() { }
}
exports.Store = Store;
