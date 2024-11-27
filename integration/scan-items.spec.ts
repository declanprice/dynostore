import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {  eq, Store } from '../src'
import { wait } from './wait'

const client = new DynamoDBClient({ endpoint: 'http://127.0.0.1:8000', region: 'eu-west-1' })

const tableName = 'TestTable'

const store = new Store(tableName, client)

type CustomerItem = {
  pk: string
  sk: string
  name: string
}

describe('ScanItems', () => {
  const customers: CustomerItem[] = [
    {
      pk: `customer`,
      sk: 'invoice-1',
      name: `declan`
    },
    {
      pk: `customer`,
      sk: 'invoice-12',
      name: `ryan`
    },
    {
      pk: `customer`,
      sk: 'invoice-3',
      name: `declan`
    }
  ]

  beforeAll(async () => {
    const { items } = await store.scan<any>().exec()

    for (const item of items) {
      await store.delete().key({ pk: item.pk, sk: item.sk }).exec()
    }
  })

  beforeEach(async () => {
    for (const customer of customers) {
      await store.put().item(customer).exec()
    }

    await wait(100)
  })

  it('should scan items successfully', async () => {
    const { items } = await store.scan<any>().exec()

    expect(items).toHaveLength(3)
  })

  it('should scan items successfully with filter', async () => {
    const { items } = await store.scan<any>().filter(eq('name', 'ryan')).exec()

    expect(items).toHaveLength(1)
  })
})
