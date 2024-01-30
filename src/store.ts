import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetItemBuilder } from './builders/get-item-builder'
import { PutItemBuilder } from './builders/put-item-builder'
import { QueryItemsBuilder } from './builders/query-builder'
import { DeleteItemBuilder } from './builders/delete-item-builder'
import { UpdateItemBuilder } from './builders/update-item-builder'
import { ScanItemsBuilder } from './builders/scan-items-builder'

export class Store {
  constructor(
    readonly tableName: string,
    readonly client: DynamoDBClient
  ) {}

  get() {
    return new GetItemBuilder(this.tableName, this.client)
  }

  put() {
    return new PutItemBuilder(this.tableName, this.client)
  }

  update() {
    return new UpdateItemBuilder(this.tableName, this.client)
  }

  delete() {
    return new DeleteItemBuilder(this.tableName, this.client)
  }

  query() {
    return new QueryItemsBuilder(this.tableName, this.client)
  }

  scan() {
    return new ScanItemsBuilder(this.tableName, this.client)
  }
}

const store = new Store('asd', {} as any)
