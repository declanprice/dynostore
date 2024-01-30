import { AttributeValue, DynamoDBClient, PutItemCommand, TransactWriteItem } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import {
  CreateConditionExpression,
  createConditionExpression
} from '../expressions/condition/create-condition-expression'

type PutBuilderOptions = {
  item?: any
  conditionExpression?: string
  expressionAttributeNames?: { [key: string]: string }
  expressionAttributeValues?: { [key: string]: AttributeValue }
  returnOld?: boolean
}

export class PutItemBuilder {
  private options: PutBuilderOptions = {}

  constructor(
    readonly tableName: string,
    readonly client: DynamoDBClient
  ) {}

  item(item: any): PutItemBuilder {
    this.options.item = item
    return this
  }

  condition(...conditions: CreateConditionExpression[]): PutItemBuilder {
    const { expression, expressionAttributeNames, expressionAttributeValues } = createConditionExpression(
      'condition',
      ...conditions
    )
    this.options.conditionExpression = expression
    this.options.expressionAttributeNames = expressionAttributeNames
    this.options.expressionAttributeValues = expressionAttributeValues
    return this
  }

  returnOld(): PutItemBuilder {
    this.options.returnOld = true
    return this
  }

  async exec(): Promise<void> {
    const { item, conditionExpression, expressionAttributeNames, expressionAttributeValues, returnOld } = this.options

    if (!item) throw new Error('[invalid options] - item is missing')

    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(item),
        ConditionExpression: conditionExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: returnOld === true ? 'ALL_OLD' : 'NONE'
      })
    )
  }

  tx(): TransactWriteItem {
    const { item, conditionExpression, expressionAttributeNames, expressionAttributeValues, returnOld } = this.options

    if (!item) throw new Error('[invalid options] - item is missing')

    return {
      Put: {
        TableName: this.tableName,
        Item: marshall(item),
        ConditionExpression: conditionExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValuesOnConditionCheckFailure: returnOld === true ? 'ALL_OLD' : 'NONE'
      }
    }
  }
}
