import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { ConditionExpression, createConditionExpression } from '../expressions/condition/condition-expression'
import { ItemKey } from '../item/item-key'
import { Expression } from '../expressions/expression'
import { ExpressionAttributes } from '../expressions'

export type ScanResponse<Item> = {
  items: Item[]
  lastKey: any | null
}

type ScanItemsBuilderOptions = {
  indexName?: string
  projection?: string
  filterExpression?: Expression
  limit?: number
  startAt?: ItemKey
  sort?: 'asc' | 'desc'
  consistent?: boolean
  parallel?: {
    totalSegments: number
    segment: number
  }
}

export class ScanItemsBuilder<Item> {
  private options: ScanItemsBuilderOptions = {}
  private readonly attributes = new ExpressionAttributes()

  constructor(
    readonly tableName: string,
    readonly client: DynamoDBClient
  ) {
  }

  using(indexName: string): ScanItemsBuilder<Item> {
    this.options.indexName = indexName
    return this
  }

  filter(...conditions: ConditionExpression[]): ScanItemsBuilder<Item> {
    this.options.filterExpression = createConditionExpression(this.attributes, this.options.filterExpression, ...conditions)
    return this
  }

  project(projection: string): ScanItemsBuilder<Item> {
    this.options.projection = projection
    return this
  }

  limit(limit: number): ScanItemsBuilder<Item> {
    this.options.limit = limit
    return this
  }

  startAt(key: ItemKey): ScanItemsBuilder<Item> {
    this.options.startAt = key
    return this
  }

  consistent(): ScanItemsBuilder<Item> {
    this.options.consistent = true
    return this
  }

  parallel(totalSegments: number, segment: number): ScanItemsBuilder<Item> {
    this.options.parallel = {
      totalSegments,
      segment
    }
    return this
  }

  async exec(): Promise<ScanResponse<Item>> {
    const { indexName, consistent, projection, filterExpression, limit, startAt, parallel } = this.options

    const response = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        IndexName: indexName,
        ConsistentRead: consistent,
        ProjectionExpression: projection,
        FilterExpression: filterExpression?.expression,
        ExpressionAttributeNames: this.attributes?.expressionAttributeNames,
        ExpressionAttributeValues: this.attributes?.expressionAttributeValues,
        Limit: limit,
        ExclusiveStartKey: startAt ? marshall(startAt, {
          convertClassInstanceToMap: true,
          removeUndefinedValues: true
        }) : undefined,
        TotalSegments: parallel?.totalSegments,
        Segment: parallel?.segment
      })
    )

    if (!response.Items) {
      return {
        items: [],
        lastKey: null
      }
    }

    return {
      items: response.Items.map((i) => unmarshall(i)) as Item[],
      lastKey: response.LastEvaluatedKey ? unmarshall(response.LastEvaluatedKey) : null
    }
  }
}
