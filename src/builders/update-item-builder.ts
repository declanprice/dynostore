import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Expression } from '../expressions/expression'

type UpdateItemBuilderOptions = {
  item?: any
  conditionExpression?: Expression
  updateExpression?: Expression
}

export class UpdateItemBuilder {
  private options: UpdateItemBuilderOptions = {}

  constructor(
    readonly tableName: string,
    readonly client: DynamoDBClient
  ) {}
}
