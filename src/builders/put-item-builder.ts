import { DynamoDBClient, PutItemCommand, TransactWriteItem } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import {
  createConditionExpression,
  CreateConditionExpression
} from '../expressions/condition/create-condition-expression'
import { Expression } from '../expressions/expression'

type PutBuilderOptions = {
  item?: any
  conditionExpression?: Expression
  returnOld?: boolean
}

export class PutItemBuilder {
  private options: PutBuilderOptions = {}

  constructor(
    private readonly tableName: string,
    private readonly client: DynamoDBClient
  ) {}

  item(item: any): PutItemBuilder {
    this.options.item = item
    return this
  }

  condition(...conditions: CreateConditionExpression[]): PutItemBuilder {
    this.options.conditionExpression = createConditionExpression('condition', ...conditions)
    return this
  }

  returnOld(): PutItemBuilder {
    this.options.returnOld = true
    return this
  }

  async exec(): Promise<void> {
    const { item, conditionExpression, returnOld } = this.options

    if (!item) throw new Error('[invalid options] - item is missing')

    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(item),
        ConditionExpression: conditionExpression?.expression,
        ExpressionAttributeNames: conditionExpression?.expressionAttributeNames,
        ExpressionAttributeValues: conditionExpression?.expressionAttributeValues,
        ReturnValues: returnOld === true ? 'ALL_OLD' : 'NONE'
      })
    )
  }

  tx(): TransactWriteItem {
    const { item, conditionExpression, returnOld } = this.options

    if (!item) throw new Error('[invalid options] - item is missing')

    return {
      Put: {
        TableName: this.tableName,
        Item: marshall(item),
        ConditionExpression: conditionExpression?.expression,
        ExpressionAttributeNames: conditionExpression?.expressionAttributeNames,
        ExpressionAttributeValues: conditionExpression?.expressionAttributeValues,
        ReturnValuesOnConditionCheckFailure: returnOld === true ? 'ALL_OLD' : 'NONE'
      }
    }
  }
}
