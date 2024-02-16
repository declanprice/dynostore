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

export type QueryResponse<Item> = {
  items: Item[]
  lastKey: any | null
}

type QueryBuilderOptions = {
  indexName?: string
  pk?: {
    path: string
    value: string | number
  }
  sk?: {
    condition: Expression
  }
  projection?: string
  filter?: Expression
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
  ) {}

  pk(path: string, value: string | number): QueryItemsBuilder<Item> {
    this.options.pk = {
      path,
      value
    }
    return this
  }

  sk(condition: KeyConditionExpression): QueryItemsBuilder<Item> {
    this.options.sk = {
      condition: createConditionExpression(this.attributes, condition)
    }
    return this
  }

  using(indexName: string): QueryItemsBuilder<Item> {
    this.options.indexName = indexName
    return this
  }

  filter(...conditions: ConditionExpression[]): QueryItemsBuilder<Item> {
    this.options.filter = createConditionExpression(this.attributes, ...conditions)
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
    const { pk, sk, projection, filter, limit, startAt, sort } = this.options

    if (!pk) throw new Error('[invalid options] - pk is missing')

    const response = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: this.options.indexName,
        ProjectionExpression: projection,
        KeyConditionExpression: sk?.condition.expression,
        FilterExpression: filter?.expression,
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

    const queryResponse: QueryResponse<Item> = {
      items: response.Items.map((i) => unmarshall(i)) as Item[],
      lastKey: response.LastEvaluatedKey ? unmarshall(response.LastEvaluatedKey) : null
    }

    return queryResponse
  }
}
