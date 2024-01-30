import {AttributeValue, DynamoDBClient, PutItemCommand, TransactWriteItem} from "@aws-sdk/client-dynamodb";
import {marshall} from "@aws-sdk/util-dynamodb";
import {ConditionExpression, convertToExpression} from "../expressions/condition/condition-expression";

type PutBuilderOptions = {
    item?: any,
    conditionExpression?: string
    expressionAttributeNames?: { [key: string]: string }
    expressionAttributeValues?: { [key: string]: AttributeValue }
}

export class PutItemBuilder {

    private options: PutBuilderOptions = {}

    constructor(readonly tableName: string, readonly client: DynamoDBClient) {}

    item(item: any): PutItemBuilder {
        this.options.item = item;
        return this;
    }

    condition(...conditions: ConditionExpression[]): PutItemBuilder {
        const {expression, expressionAttributeNames, expressionAttributeValues} = convertToExpression(...conditions);
        this.options.conditionExpression = expression;
        this.options.expressionAttributeNames = expressionAttributeNames;
        this.options.expressionAttributeValues = expressionAttributeValues
        return this;
    }

    async exec(): Promise<void> {
        const { item, conditionExpression, expressionAttributeNames, expressionAttributeValues } = this.options;

        if (!item) throw new Error('[invalid options] - item is missing');

        await this.client.send(new PutItemCommand({
            TableName: this.tableName,
            Item: marshall(item),
            ConditionExpression: conditionExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues
        }))
    }

    tx(): TransactWriteItem {
        const { item, conditionExpression, expressionAttributeNames, expressionAttributeValues } = this.options;

        if (!item) throw new Error('[invalid options] - item is missing');

        return {
            Put: {
                TableName: this.tableName,
                Item: marshall(item),
                ConditionExpression: conditionExpression,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues
            }
        }
    }
}


// store
//     .put(item)
//     .condition(
//         group([eq('name', 'declan'), or(), eq('name', 'ryan')]),
//         and(),
//         lt('age', 25)
//     )
