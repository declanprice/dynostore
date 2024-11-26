import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import {
  ConditionExpression,
  createConditionExpression,
  KeyConditionExpression
} from '../expressions/condition/condition-expression'
import { ItemKey } from '../item/item-key'
import { Expression } from '../expressions/expression'
import { ExpressionAttributes } from '../expressions'

type QueryBuilderOptions = {
  indexName?: string
  pk?: {
    path: string
    value: string | number
  }
  sk?: {
    path: string
    conditionExpression: Expression
  }
  projection?: string
  filterExpression?: Expression
  limit?: number
  startAt?: ItemKey
  sort?: 'asc' | 'desc'
}

export class QueryItemsBuilder<Item> {
  private options: QueryBuilderOptions = {}
  private attributes = new ExpressionAttributes()

  constructor(
    private readonly tableName: string,
    private readonly client: DynamoDBClient
  ) {
  }

  pk(path: string, value: string | number): QueryItemsBuilder<Item> {
    this.options.pk = {
      path,
      value
    }
    return this
  }

  sk(path: string, condition: KeyConditionExpression): QueryItemsBuilder<Item> {
    this.options.sk = {
      path,
      conditionExpression: createConditionExpression(this.attributes, undefined, condition)
    }
    return this
  }

  using(indexName: string): QueryItemsBuilder<Item> {
    this.options.indexName = indexName
    return this
  }

  filter(...conditions: ConditionExpression[]): QueryItemsBuilder<Item> {
    this.options.filterExpression = createConditionExpression(this.attributes, this.options.filterExpression, ...conditions)
    return this
  }

  project(projection: string): QueryItemsBuilder<Item> {
    this.options.projection = projection
    return this
  }

  limit(limit: number): QueryItemsBuilder<Item> {
    this.options.limit = limit
    return this
  }

  startAt(key: ItemKey): QueryItemsBuilder<Item> {
    this.options.startAt = key
    return this
  }

  sort(dir: 'asc' | 'desc'): QueryItemsBuilder<Item> {
    this.options.sort = dir
    return this
  }

  async exec(): Promise<{ items: Item[]; lastKey: ItemKey | null }> {
    const { pk, sk, projection, filterExpression, limit, startAt, sort } = this.options

    if (!pk) throw new Error('[invalid options] - pk is missing')

    const response = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: this.options.indexName,
        ProjectionExpression: projection,
        KeyConditionExpression: sk?.conditionExpression.expression,
        FilterExpression: filterExpression?.expression,
        ExpressionAttributeNames: this.attributes.expressionAttributeNames,
        ExpressionAttributeValues: this.attributes.expressionAttributeValues,
        Limit: limit,
        ExclusiveStartKey: marshall(startAt, { removeUndefinedValues: true }),
        ScanIndexForward: sort !== 'desc'
      })
    )

    if (!response.Items) {
      return [] as any
    }

    return {
      items: response.Items.map((i) => unmarshall(i)) as Item[],
      lastKey: response.LastEvaluatedKey ? unmarshall(response.LastEvaluatedKey) : null
    }
  }
}
