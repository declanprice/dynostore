import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { Store } from '../src/store'
import { marshall } from '@aws-sdk/util-dynamodb'
import { wait } from './wait'

const client = new DynamoDBClient()

const tableName = 'TestTable'

const store = new Store(tableName, client)

type CustomerItem = {
  pk: string
  sk: string
  name: string
}

describe('PutItem', () => {
  const customer: CustomerItem = {
    pk: '1',
    sk: 'customer',
    name: 'test'
  }

  it('should put item successfully', async () => {
    const item = await store.put<CustomerItem>().item(customer).exec()
    expect(item).toBeNull()
    await wait(100)
    const getItem = await store.get<CustomerItem>().key({ pk: customer.pk, sk: customer.sk }).exec()
    expect(getItem).toBeTruthy()
  })

  it('should put item successfully and return values', async () => {
    const item = await store.put<CustomerItem>().item(customer).returnOld().exec()
    expect(item).toBeNull()
    await wait(100)
  })
})
