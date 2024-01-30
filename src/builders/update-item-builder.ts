import { DynamoDBClient, ReturnValue, TransactWriteItem, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { Expression } from '../expressions/expression'
import { ItemKey } from '../item/item-key'
import { createUpdateExpression, UpdateExpression } from '../expressions/update/update-expression'
import { ConditionExpression, createConditionExpression } from '../expressions/condition/condition-expression'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

type UpdateItemBuilderOptions = {
  key?: ItemKey
  conditionExpression?: Expression
  updateExpression?: Expression
  returnValue?: ReturnValue
}

export class UpdateItemBuilder<Item> {
  private options: UpdateItemBuilderOptions = {}

  constructor(
    private readonly tableName: string,
    private readonly client: DynamoDBClient
  ) {}

  key(key: ItemKey): UpdateItemBuilder<Item> {
    this.options.key = key
    return this
  }

  condition(...conditions: ConditionExpression[]): UpdateItemBuilder<Item> {
    this.options.conditionExpression = createConditionExpression('condition', ...conditions)
    return this
  }

  update(...updates: UpdateExpression[]): UpdateItemBuilder<Item> {
    this.options.updateExpression = createUpdateExpression('update', ...updates)
    return this
  }

  return(returnValue: ReturnValue): UpdateItemBuilder<Item> {
    this.options.returnValue = returnValue
    return this
  }

  async exec(): Promise<Item | null> {
    const { key, updateExpression, conditionExpression, returnValue } = this.options
    if (!key) throw new Error('[invalid options] - key is required')
    if (!updateExpression) throw new Error('[invalid options] - update expression is required')

    const result = await this.client.send(
      new UpdateItemCommand({
        TableName: this.tableName,
        Key: marshall(key),
        UpdateExpression: updateExpression.expression,
        ConditionExpression: conditionExpression?.expression,
        ExpressionAttributeNames: {
          ...updateExpression.expressionAttributeNames,
          ...conditionExpression?.expressionAttributeNames
        },
        ExpressionAttributeValues: {
          ...updateExpression.expressionAttributeValues,
          ...conditionExpression?.expressionAttributeValues
        },
        ReturnValues: returnValue
      })
    )

    if (!result.Attributes) return null

    return unmarshall(result.Attributes) as Item
  }

  tx(): TransactWriteItem {
    const { key, updateExpression, conditionExpression, returnValue } = this.options
    if (!key) throw new Error('[invalid options] - key is required')
    if (!updateExpression) throw new Error('[invalid options] - update expression is required')

    return {
      Update: {
        TableName: this.tableName,
        Key: marshall(key),
        UpdateExpression: updateExpression.expression,
        ConditionExpression: conditionExpression?.expression,
        ExpressionAttributeNames: {
          ...updateExpression.expressionAttributeNames,
          ...conditionExpression?.expressionAttributeNames
        },
        ExpressionAttributeValues: {
          ...updateExpression.expressionAttributeValues,
          ...conditionExpression?.expressionAttributeValues
        },
        ReturnValuesOnConditionCheckFailure: returnValue === 'ALL_OLD' ? 'ALL_OLD' : undefined
      }
    }
  }
}
