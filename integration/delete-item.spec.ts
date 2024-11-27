import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Store } from '../src/store'
import { wait } from './wait'

const client = new DynamoDBClient({
  endpoint: 'http://127.0.0.1:8000', region: 'eu-west-1', credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
})

const tableName = 'TestTable'

const store = new Store(tableName, client)

type CustomerItem = {
  pk: string
  sk: string
  name: string
}

describe('DeleteItem', () => {
  const customer: CustomerItem = {
    pk: 'customer',
    sk: 'invoice-1',
    name: 'declan'
  }

  beforeAll(async () => {
    const { items } = await store.scan<any>().exec()

    for (const item of items) {
      await store.delete().key({ pk: item.pk, sk: item.sk }).exec()
    }
  })

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
