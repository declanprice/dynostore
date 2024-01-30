import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import {
  ConditionExpression,
  createConditionExpression,
  KeyConditionExpression
} from '../expressions/condition/condition-expression'
import { ItemKey } from '../item/item-key'
import { Expression } from '../expressions/expression'

type QueryBuilderOptions = {
  indexName?: string
  pk?: {
    path: string
    value: string | number
  }
  sk?: {
    path: string
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

  constructor(
    private readonly tableName: string,
    private readonly client: DynamoDBClient
  ) {}

  pk(path: string, value: string | number) {
    this.options.pk = {
      path,
      value
    }
  }
  sk(path: string, condition: KeyConditionExpression) {
    this.options.sk = {
      path,
      condition: createConditionExpression('key', condition)
    }
  }

  filter(...conditions: ConditionExpression[]): QueryItemsBuilder<Item> {
    this.options.filter = createConditionExpression('filter', ...conditions)
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
        ExpressionAttributeNames: { ...sk?.condition.expressionAttributeNames, ...filter?.expressionAttributeNames },
        ExpressionAttributeValues: { ...sk?.condition.expressionAttributeValues, ...filter?.expressionAttributeValues },
        Limit: limit,
        ExclusiveStartKey: marshall(startAt),
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
