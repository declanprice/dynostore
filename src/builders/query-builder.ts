import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import {
  CreateConditionExpression,
  createConditionExpression,
  Expression,
  KeyConditionExpression
} from '../expressions/condition/create-condition-expression'
import { ItemKey } from '../item/item-key'

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

export class QueryItemsBuilder {
  private options: QueryBuilderOptions = {}

  constructor(
    readonly tableName: string,
    readonly client: DynamoDBClient
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

  filter(...conditions: CreateConditionExpression[]): QueryItemsBuilder {
    this.options.filter = createConditionExpression('filter', ...conditions)
    return this
  }

  project(projection: string): QueryItemsBuilder {
    this.options.projection = projection
    return this
  }

  limit(limit: number): QueryItemsBuilder {
    this.options.limit = limit
    return this
  }

  startAt(key: ItemKey): QueryItemsBuilder {
    this.options.startAt = key
    return this
  }

  sort(dir: 'asc' | 'desc'): QueryItemsBuilder {
    this.options.sort = dir
    return this
  }

  async exec<ItemType>(): Promise<{ items: ItemType[]; lastKey: ItemKey | null }> {
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
      items: response.Items.map((i) => unmarshall(i)) as ItemType[],
      lastKey: response.LastEvaluatedKey ? unmarshall(response.LastEvaluatedKey) : null
    }
  }
}
