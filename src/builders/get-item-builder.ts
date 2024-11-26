import { DynamoDBClient, GetItemCommand, TransactGetItem } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { ItemKey } from '../item/item-key'

type GetBuilderOptions<Item> = {
  key?: ItemKey
  consistent?: boolean
  projection?: string
}

export class GetItemBuilder<Item> {
  private readonly options: GetBuilderOptions<Item>

  constructor(
    private readonly tableName: string,
    private readonly client: DynamoDBClient,
    private readonly defaults: GetBuilderOptions<Item> = {}
  ) {
    this.options = { ...defaults }
  }

  key(key: ItemKey): GetItemBuilder<Item> {
    this.options.key = key
    return this
  }

  consistent(): GetItemBuilder<Item> {
    this.options.consistent = true
    return this
  }

  project(projection: string): GetItemBuilder<Item> {
    this.options.projection = projection
    return this
  }

  async exec(): Promise<Item | null> {
    const { key, consistent, projection } = this.options

    if (!key) throw new Error('[InvalidOptions] - key is missing')

    const response = await this.client.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: marshall(key, { convertClassInstanceToMap: true, removeUndefinedValues: true }),
        ConsistentRead: consistent,
        ProjectionExpression: projection
      })
    )

    if (!response.Item) return null

    return unmarshall(response.Item) as Item
  }

  tx(): TransactGetItem {
    const { key, projection } = this.options

    if (!key) throw new Error('[InvalidOptions] - key is missing')

    return {
      Get: {
        TableName: this.tableName,
        Key: marshall(key, { convertClassInstanceToMap: true, removeUndefinedValues: true }),
        ProjectionExpression: projection
      }
    }
  }
}
