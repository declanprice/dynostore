import {DynamoDBClient, PutItemCommand, TransactWriteItem} from "@aws-sdk/client-dynamodb";
import {marshall} from "@aws-sdk/util-dynamodb";

type PutBuilderOptions = {
    item?: any,
    conditionExpression?: string
}

export class PutItemBuilder {

    private options: PutBuilderOptions = {}

    constructor(readonly tableName: string, readonly client: DynamoDBClient) {}

    item(item: any): PutItemBuilder {
        this.options.item = item;
        return this;
    }

    condition(): PutItemBuilder {
        return this;
    }

    async exec(): Promise<void> {
        const { item, conditionExpression } = this.options;

        if (!item) throw new Error('[invalid options] - item is missing');

        await this.client.send(new PutItemCommand({
            TableName: this.tableName,
            Item: marshall(item),
            ConditionExpression: conditionExpression,
        }))
    }

    tx(): TransactWriteItem {}
}


// store
//     .put(item)
//     .condition(
//         group([eq('name', 'declan'), or(), eq('name', 'ryan')]),
//         and(),
//         lt('age', 25)
//     )
