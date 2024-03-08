import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Store } from '../src/store'
import { beginsWith } from '../src'
import { wait } from './wait'

const client = new DynamoDBClient()

const tableName = 'TestTable'

const store = new Store(tableName, client)

type CustomerItem = {
  pk: string
  sk: string
  name: string
}

describe.only('QueryItems', () => {
  const customers: CustomerItem[] = [
    {
      pk: `1`,
      sk: 'customer',
      name: `test-1`
    },
    {
      pk: `2`,
      sk: 'customer1',
      name: `test-2`
    },
    {
      pk: `2`,
      sk: 'customer2',
      name: `test-2`
    }
  ]

  beforeEach(async () => {
    for (const customer of customers) {
      await store.put().item({ pk: customer.pk, sk: customer.sk }).exec()
    }

    await wait(100)
  })

  it('should query items successfully with pk only', async () => {
    const { items } = await store.query<any>().pk('pk', '1').exec()

    expect(items).toHaveLength(1);
  })

  it('should query items successfully with pk and sk', async () => {
    const { items } = await store.query<any>().pk('pk', '2').sk(beginsWith('sk', 'customer')).exec()

    expect(items).toHaveLength(2);
  })
})
