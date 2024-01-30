import { DeleteItemCommand, DynamoDBClient, TransactWriteItem } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { ItemKey } from '../item/item-key'
import { ConditionExpression, createConditionExpression } from '../expressions/condition/condition-expression'
import { Expression } from '../expressions/expression'
import { ExpressionAttributes } from '../expressions'

type DeleteBuilderOptions = {
  key?: ItemKey
  condition?: Expression
  returnOld?: boolean
}

export class DeleteItemBuilder<Item> {
  private readonly options: DeleteBuilderOptions
  private readonly attributes = new ExpressionAttributes()
  constructor(
    private readonly tableName: string,
    private readonly client: DynamoDBClient,
    private readonly defaults: DeleteBuilderOptions = {}
  ) {
    this.options = { ...defaults }
  }

  key(key: ItemKey): DeleteItemBuilder<Item> {
    this.options.key = key
    return this
  }

  condition(...conditions: ConditionExpression[]): DeleteItemBuilder<Item> {
    this.options.condition = createConditionExpression(this.attributes, ...conditions)
    return this
  }

  returnOld(): DeleteItemBuilder<Item> {
    this.options.returnOld = true
    return this
  }

  async exec(): Promise<Item | null> {
    const { key, condition, returnOld } = this.options

    if (!key) throw new Error('[invalid options] - key is missing')

    const result = await this.client.send(
      new DeleteItemCommand({
        TableName: this.tableName,
        Key: marshall(key),
        ConditionExpression: condition?.expression,
        ExpressionAttributeNames: this.attributes?.expressionAttributeNames,
        ExpressionAttributeValues: this.attributes?.expressionAttributeValues,
        ReturnValues: returnOld ? 'ALL_OLD' : 'NONE',
        ReturnValuesOnConditionCheckFailure: returnOld ? 'ALL_OLD' : 'NONE'
      })
    )

    if (!result?.Attributes) return null

    return unmarshall(result.Attributes) as Item
  }

  tx(): TransactWriteItem {
    const { key, condition, returnOld } = this.options

    if (!key) throw new Error('[invalid options] - key is missing')

    return {
      Delete: {
        TableName: this.tableName,
        Key: marshall(key),
        ConditionExpression: condition?.expression,
        ExpressionAttributeNames: this.attributes?.expressionAttributeNames,
        ExpressionAttributeValues: this.attributes?.expressionAttributeValues,
        ReturnValuesOnConditionCheckFailure: returnOld ? 'ALL_OLD' : 'NONE'
      }
    }
  }
}
