import { DynamoDBClient, GetItemCommand, TransactGetItem } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { ItemKey } from '../item/item-key'

type GetBuilderOptions = {
  key?: ItemKey
  consistent?: boolean
  projection?: string
}

export class GetItemBuilder {
  private readonly options: GetBuilderOptions

  constructor(
    readonly tableName: string,
    readonly client: DynamoDBClient,
    readonly defaults: GetBuilderOptions = {}
  ) {
    this.options = { ...defaults }
  }

  key(key: ItemKey): GetItemBuilder {
    this.options.key = key
    return this
  }

  consistent(consistent?: boolean): GetItemBuilder {
    this.options.consistent = consistent
    return this
  }

  project(projection: string): GetItemBuilder {
    this.options.projection = projection
    return this
  }

  async exec<Item>(): Promise<Item | null> {
    const { key, consistent, projection } = this.options

    if (!key) throw new Error('[invalid options] - key is missing')

    const response = await this.client.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: marshall(key),
        ConsistentRead: consistent,
        ProjectionExpression: projection
      })
    )

    if (!response.Item) return null

    return unmarshall(response.Item) as Item
  }

  tx(): TransactGetItem {
    const { key, projection } = this.options

    if (!key) throw new Error('[invalid options] - key is missing')

    return {
      Get: {
        TableName: this.tableName,
        Key: marshall(key),
        ProjectionExpression: projection
      }
    }
  }
}
