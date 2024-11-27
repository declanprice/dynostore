import { DynamoDBClient, ReturnValue, TransactWriteItem, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { Expression } from '../expressions/expression'
import { ItemKey } from '../item/item-key'
import { createUpdateExpression, UpdateExpression } from '../expressions/update/update-expression'
import { ConditionExpression, createConditionExpression } from '../expressions/condition/condition-expression'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { ExpressionAttributes } from '../expressions'

type UpdateItemBuilderOptions = {
  key?: ItemKey
  conditionExpression?: Expression
  updateExpression?: Expression
  returnValue?: ReturnValue
}

export class UpdateItemBuilder<Item> {
  private options: UpdateItemBuilderOptions = {}
  private readonly attributes = new ExpressionAttributes()

  constructor(
    private readonly tableName: string,
    private readonly client: DynamoDBClient
  ) {
  }

  key(key: ItemKey): UpdateItemBuilder<Item> {
    this.options.key = key
    return this
  }

  condition(...conditions: ConditionExpression[]): UpdateItemBuilder<Item> {
    this.options.conditionExpression = createConditionExpression(this.attributes, this.options.conditionExpression, ...conditions)
    return this
  }

  update(...updates: UpdateExpression[]): UpdateItemBuilder<Item> {
    this.options.updateExpression = createUpdateExpression(this.attributes, this.options.updateExpression, ...updates)
    return this
  }

  return(returnValue: ReturnValue): UpdateItemBuilder<Item> {
    this.options.returnValue = returnValue
    return this
  }

  async exec(): Promise<Item | null> {
    const { key, updateExpression, conditionExpression, returnValue } = this.options
    if (!key) throw new Error('[InvalidOptions] - key is required')
    if (!updateExpression) throw new Error('[InvalidOptions] - update expression is required')

    const result = await this.client.send(
      new UpdateItemCommand({
        TableName: this.tableName,
        Key: marshall(key, { convertClassInstanceToMap: true, removeUndefinedValues: true }),
        UpdateExpression: updateExpression.expression,
        ConditionExpression: conditionExpression?.expression,
        ExpressionAttributeNames: this.attributes.expressionAttributeNames,
        ExpressionAttributeValues: this.attributes.expressionAttributeValues,
        ReturnValues: returnValue
      })
    )

    if (!result?.Attributes) return null

    return unmarshall(result.Attributes) as Item
  }

  tx(): TransactWriteItem {
    const { key, updateExpression, conditionExpression, returnValue } = this.options
    if (!key) throw new Error('[InvalidOptions] - key is required')
    if (!updateExpression) throw new Error('[InvalidOptions] - update expression is required')
    if (returnValue && returnValue != 'ALL_OLD' && returnValue != 'NONE') {
      throw new Error('[InvalidOptions] - only ALL_OLD or NONE returnValue is supported for transactions')
    }
    return {
      Update: {
        TableName: this.tableName,
        Key: marshall(key, { convertClassInstanceToMap: true, removeUndefinedValues: true }),
        UpdateExpression: updateExpression.expression,
        ConditionExpression: conditionExpression?.expression,
        ExpressionAttributeNames: this.attributes.expressionAttributeNames,
        ExpressionAttributeValues: this.attributes.expressionAttributeValues,
        ReturnValuesOnConditionCheckFailure: returnValue
      }
    }
  }
}
