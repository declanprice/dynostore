import {DynamoDBClient, GetItemCommand, TransactGetItem} from "@aws-sdk/client-dynamodb";
import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";
import {ItemKey} from "../item/item-key";

type GetBuilderOptions = {
    key?: ItemKey,
    consistent?: boolean;
}

export class GetItemBuilder {

    private options: GetBuilderOptions = {}

    constructor(readonly tableName: string, readonly client: DynamoDBClient) {}

    key(key: ItemKey): GetItemBuilder {
        this.options.key = key;
        return this;
    }

    consistent(isConsistent: boolean): GetItemBuilder {
        this.options.consistent = isConsistent;
        return this;
    }

    async exec<Item>(): Promise<Item | null> {
        const { key, consistent } = this.options;

        if (!key) throw new Error('[invalid options] - key is missing');

        const response = await this.client.send(new GetItemCommand({
            TableName: this.tableName,
            Key: marshall(key),
            ConsistentRead: consistent,
        }));

        if (!response.Item) return null;

        return unmarshall(response.Item) as Item;
    }

    tx(): TransactGetItem {
        const { key } = this.options;

        if (!key) throw new Error('[invalid options] - key is missing');

        return {
            Get: {
                TableName: this.tableName,
                Key: marshall(key),
            }
        }
    }
}