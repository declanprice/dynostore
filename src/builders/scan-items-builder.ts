import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import {
  CreateConditionExpression,
  createConditionExpression,
  Expression
} from '../expressions/condition/create-condition-expression'
import { ItemKey } from '../item/item-key'

type ScanItemsBuilderOptions = {
  indexName?: string
  projection?: string
  filter?: Expression
  limit?: number
  startAt?: ItemKey
  sort?: 'asc' | 'desc'
  consistent?: boolean
  parallel?: {
    totalSegments: number
    segment: number
  }
}

export class ScanItemsBuilder {
  private options: ScanItemsBuilderOptions = {}

  constructor(
    readonly tableName: string,
    readonly client: DynamoDBClient
  ) {}

  using(indexName: string): ScanItemsBuilder {
    this.options.indexName = indexName
    return this
  }

  filter(...conditions: CreateConditionExpression[]): ScanItemsBuilder {
    this.options.filter = createConditionExpression('filter', ...conditions)
    return this
  }

  project(projection: string): ScanItemsBuilder {
    this.options.projection = projection
    return this
  }

  limit(limit: number): ScanItemsBuilder {
    this.options.limit = limit
    return this
  }

  startAt(key: ItemKey): ScanItemsBuilder {
    this.options.startAt = key
    return this
  }

  consistent(): ScanItemsBuilder {
    this.options.consistent = true
    return this
  }

  parallel(totalSegments: number, segment: number): ScanItemsBuilder {
    this.options.parallel = {
      totalSegments,
      segment
    }
    return this
  }

  async exec<ItemType>(): Promise<{ items: ItemType[]; lastKey: ItemKey | null }> {
    const { indexName, consistent, projection, filter, limit, startAt, parallel } = this.options

    const response = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        IndexName: indexName,
        ConsistentRead: consistent,
        ProjectionExpression: projection,
        FilterExpression: filter?.expression,
        ExpressionAttributeNames: { ...filter?.expressionAttributeNames },
        ExpressionAttributeValues: { ...filter?.expressionAttributeValues },
        Limit: limit,
        ExclusiveStartKey: marshall(startAt),
        TotalSegments: parallel?.totalSegments,
        Segment: parallel?.segment
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
