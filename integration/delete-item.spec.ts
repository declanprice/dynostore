import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Store } from '../src/store'
import { wait } from './wait'

const client = new DynamoDBClient()

const tableName = 'TestTable'

const store = new Store(tableName, client)

type CustomerItem = {
  pk: string
  sk: string
  name: string
  version: number
}

describe.only('DeleteItem', () => {
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

  it('should delete item successfully', async () => {
    const key = { pk: customer.pk, sk: customer.sk }

    await store
      .delete()
      .key(key)
      .exec()

    const item = await store.get<any>().key(key).exec()

    expect(item).toBeNull()
  })
})
