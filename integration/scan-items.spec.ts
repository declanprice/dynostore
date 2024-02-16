import { ConditionalCheckFailedException, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Store } from '../src/store'
import { wait } from './wait'
import { notExists } from '../src/expressions/condition/notExists'
import { eq, increment, set } from '../src'

const client = new DynamoDBClient()

const tableName = 'TestTable'

const store = new Store(tableName, client)

type CustomerItem = {
  pk: string
  sk: string
  name: string
  version: number
}

describe.only('UpdateItem', () => {
  const customer: CustomerItem = {
    pk: '1',
    sk: 'customer',
    name: 'test',
    version: 0
  }

  beforeEach(async () => {
    await store.put().item(customer).exec()
    await wait(100)
  })

  it('should update item successfully', async () => {})
})
