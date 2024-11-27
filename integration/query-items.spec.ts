import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { beginsWith, eq, Store } from '../src'
import { wait } from './wait'

const client = new DynamoDBClient()

const tableName = 'TestTable'

const store = new Store(tableName, client)

type CustomerItem = {
  pk: string
  sk: string
  name: string
}

describe('QueryItems', () => {
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

  it('should query items successfully with pk only', async () => {
    const { items } = await store.query<any>().pk(eq('pk', 'customer')).exec()

    expect(items).toHaveLength(3)
  })

  it('should query items successfully with pk and sk', async () => {
    const { items } = await store.query<any>().pk(eq('pk', 'customer')).sk(beginsWith('sk', 'invoice-1')).exec()

    expect(items).toHaveLength(2)
  })
})
