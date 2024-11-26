import { DynamoDBClient, PutItemCommand, TransactWriteItem } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { createConditionExpression, ConditionExpression } from '../expressions/condition/condition-expression'
import { Expression } from '../expressions/expression'
import { ExpressionAttributes } from '../expressions'

type PutBuilderOptions<Item> = {
  item?: Item
  conditionExpression?: Expression
  returnOld?: boolean
}

export class PutItemBuilder<Item> {
  private options: PutBuilderOptions<Item> = {}
  private attributes = new ExpressionAttributes()

  constructor(
    private readonly tableName: string,
    private readonly client: DynamoDBClient
  ) {
  }

  item(item: Item): PutItemBuilder<Item> {
    this.options.item = item
    return this
  }

  condition(...conditions: ConditionExpression[]): PutItemBuilder<Item> {
    this.options.conditionExpression = createConditionExpression(this.attributes, this.options.conditionExpression, ...conditions)

    return this
  }

  returnOld(): PutItemBuilder<Item> {
    this.options.returnOld = true
    return this
  }

  async exec(): Promise<Item | null> {
    const { item, conditionExpression, returnOld } = this.options

    if (!item) throw new Error('[invalid options] - item is missing')

    const result = await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(item, { convertClassInstanceToMap: true, removeUndefinedValues: true }),
        ConditionExpression: conditionExpression?.expression,
        ExpressionAttributeNames: this.attributes?.expressionAttributeNames,
        ExpressionAttributeValues: this.attributes?.expressionAttributeValues,
        ReturnValues: returnOld === true ? 'ALL_OLD' : 'NONE'
      })
    )

    if (!result?.Attributes) return null

    return unmarshall(result.Attributes) as Item
  }

  tx(): TransactWriteItem {
    const { item, conditionExpression, returnOld } = this.options

    if (!item) throw new Error('[invalid options] - item is missing')

    return {
      Put: {
        TableName: this.tableName,
        Item: marshall(item, { convertClassInstanceToMap: true, removeUndefinedValues: true }),
        ConditionExpression: conditionExpression?.expression,
        ExpressionAttributeNames: this.attributes?.expressionAttributeNames,
        ExpressionAttributeValues: this.attributes?.expressionAttributeValues,
        ReturnValuesOnConditionCheckFailure: returnOld === true ? 'ALL_OLD' : 'NONE'
      }
    }
  }
}
