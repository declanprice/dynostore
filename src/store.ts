import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {GetItemBuilder} from "./builders/get-item-builder";

export class Store {
    constructor(readonly tableName: string, readonly client: DynamoDBClient) {}

    get() {
        return new GetItemBuilder(this.tableName, this.client);
    }

    put() {}

    update() {}

    delete() {}

    query() {}

    scan() {}
}
