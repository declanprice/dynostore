import { DynamoDBClient, TransactWriteItem, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb'
import { GetItemBuilder } from './builders/get-item-builder'
import { PutItemBuilder } from './builders/put-item-builder'
import { QueryItemsBuilder } from './builders/query-items-builder'
import { DeleteItemBuilder } from './builders/delete-item-builder'
import { UpdateItemBuilder } from './builders/update-item-builder'
import { ScanItemsBuilder } from './builders/scan-items-builder'

export class Store {
  constructor(
    readonly tableName: string,
    readonly client: DynamoDBClient
  ) {
  }

  get<Item>() {
    return new GetItemBuilder<Item>(this.tableName, this.client)
  }

  put<Item>() {
    return new PutItemBuilder<Item>(this.tableName, this.client)
  }

  update<Item>() {
    return new UpdateItemBuilder<Item>(this.tableName, this.client)
  }

  delete<Item>() {
    return new DeleteItemBuilder<Item>(this.tableName, this.client)
  }

  query<Item>() {
    return new QueryItemsBuilder<Item>(this.tableName, this.client)
  }

  scan<Item>() {
    return new ScanItemsBuilder<Item>(this.tableName, this.client)
  }

  async transactItems(writes: TransactWriteItem[]) {
    await this.client.send(
      new TransactWriteItemsCommand({
        TransactItems: writes
      })
    )
  }
}
