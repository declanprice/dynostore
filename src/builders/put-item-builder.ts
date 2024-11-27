import { DynamoDBClient, PutItemCommand, TransactWriteItem, ReturnValue } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { createConditionExpression, ConditionExpression } from '../expressions/condition/condition-expression'
import { Expression } from '../expressions/expression'
import { ExpressionAttributes } from '../expressions'

type PutBuilderOptions<Item> = {
  item?: Item
  conditionExpression?: Expression
  returnValue?: ReturnValue
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

  return(value: ReturnValue): PutItemBuilder<Item> {
    this.options.returnValue = value
    return this
  }

  async exec(): Promise<Item | null> {
    const { item, conditionExpression, returnValue } = this.options

    if (!item) throw new Error('[InvalidOptions] - item is missing')

    const result = await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(item, { convertClassInstanceToMap: true, removeUndefinedValues: true }),
        ConditionExpression: conditionExpression?.expression,
        ExpressionAttributeNames: this.attributes?.expressionAttributeNames,
        ExpressionAttributeValues: this.attributes?.expressionAttributeValues,
        ReturnValues: returnValue
      })
    )

    if (!result?.Attributes) return null

    return unmarshall(result.Attributes) as Item
  }

  tx(): TransactWriteItem {
    const { item, conditionExpression, returnValue } = this.options

    if (!item) throw new Error('[InvalidOptions] - item is missing')

    if (returnValue && returnValue != 'ALL_OLD' && returnValue != 'NONE') {
      throw new Error('[InvalidOptions] - only ALL_OLD or NONE returnValue is supported for transactions')
    }

    return {
      Put: {
        TableName: this.tableName,
        Item: marshall(item, { convertClassInstanceToMap: true, removeUndefinedValues: true }),
        ConditionExpression: conditionExpression?.expression,
        ExpressionAttributeNames: this.attributes?.expressionAttributeNames,
        ExpressionAttributeValues: this.attributes?.expressionAttributeValues,
        ReturnValuesOnConditionCheckFailure: returnValue
      }
    }
  }
}
