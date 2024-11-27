import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Store } from '../src/store'
import { wait } from './wait'
import { and, eq, exists, increment, set } from '../src'

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
  version: number
}

describe('UpdateItem', () => {
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

  it('should update item successfully', async () => {
    await store
      .update()
      .key({ pk: customer.pk, sk: customer.sk })
      .update(set('firstName', 'changed'), set('lastName', 'changed-last'), increment('version', 1))
      .exec()
  })

  it('should update item successfully with conditions', async () => {
    await store
      .update()
      .key({ pk: customer.pk, sk: customer.sk })
      .update(set('firstName', 'changed'), set('lastName', 'changed-last'), increment('version', 1))
      .condition(exists('sk'), and(), eq('name', 'test'))
      .exec()
  })
})
