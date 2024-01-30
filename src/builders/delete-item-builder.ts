import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  ReturnValuesOnConditionCheckFailure,
  TransactGetItem,
  TransactWriteItem
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { ItemKey } from '../item/item-key'
import {
  CreateConditionExpression,
  createConditionExpression,
  Expression
} from '../expressions/condition/create-condition-expression'

type DeleteBuilderOptions = {
  key?: ItemKey
  condition?: Expression
  returnOld?: boolean
}

export class DeleteItemBuilder {
  private readonly options: DeleteBuilderOptions

  constructor(
    readonly tableName: string,
    readonly client: DynamoDBClient,
    readonly defaults: DeleteBuilderOptions = {}
  ) {
    this.options = { ...defaults }
  }

  key(key: ItemKey): DeleteItemBuilder {
    this.options.key = key
    return this
  }

  condition(...conditions: CreateConditionExpression[]): DeleteItemBuilder {
    this.options.condition = createConditionExpression('condition', ...conditions)
    return this
  }

  returnOld(): DeleteItemBuilder {
    this.options.returnOld = true
    return this
  }

  async exec(): Promise<void> {
    const { key, condition, returnOld } = this.options

    if (!key) throw new Error('[invalid options] - key is missing')

    await this.client.send(
      new DeleteItemCommand({
        TableName: this.tableName,
        Key: marshall(key),
        ConditionExpression: condition?.expression,
        ExpressionAttributeNames: condition?.expressionAttributeNames,
        ExpressionAttributeValues: condition?.expressionAttributeValues,
        ReturnValues: returnOld ? 'ALL_OLD' : 'NONE',
        ReturnValuesOnConditionCheckFailure: returnOld ? 'ALL_OLD' : 'NONE'
      })
    )
  }

  tx(): TransactWriteItem {
    const { key, condition, returnOld } = this.options

    if (!key) throw new Error('[invalid options] - key is missing')

    return {
      Delete: {
        TableName: this.tableName,
        Key: marshall(key),
        ConditionExpression: condition?.expression,
        ExpressionAttributeNames: condition?.expressionAttributeNames,
        ExpressionAttributeValues: condition?.expressionAttributeValues,
        ReturnValuesOnConditionCheckFailure: returnOld ? 'ALL_OLD' : 'NONE'
      }
    }
  }
}
