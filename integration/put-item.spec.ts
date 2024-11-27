import { ConditionalCheckFailedException, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Store } from '../src/store'
import { wait } from './wait'
import { notExists } from '../src/expressions/condition/notExists'

const client = new DynamoDBClient({ endpoint: 'http://127.0.0.1:8000', region: 'eu-west-1' })

const tableName = 'TestTable'

const store = new Store(tableName, client)

type CustomerItem = {
  pk: string
  sk: string
  name: string
}

describe('PutItem', () => {
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
    await store.delete().key({ pk: customer.pk, sk: customer.sk }).exec()
    await wait(100)
  })

  it('should put item successfully', async () => {
    const item = await store.put<CustomerItem>().item(customer).exec()
    expect(item).toBeNull()
    const getItem = await store.get<CustomerItem>().key({ pk: customer.pk, sk: customer.sk }).consistent().exec()
    expect(getItem).toBeTruthy()
  })

  it('should put item successfully and return no values', async () => {
    const item = await store.put<CustomerItem>().item(customer).exec()
    expect(item).toBeNull()
  })

  it('should put item successfully and return old values', async () => {
    await store.put<CustomerItem>().item(customer).exec()
    const item = await store.put<CustomerItem>().item(customer).return('ALL_OLD').exec()
    if (!item) throw new Error('item is null')
    expect(item).toBeTruthy()
    expect(item.pk).toEqual(customer.pk)
  })

  it('should fail put condition', async () => {
    await store.put<CustomerItem>().item(customer).exec()
    await expect(async () => {
      await store.put<CustomerItem>().item(customer).condition(notExists('pk')).exec()
    }).rejects.toThrow(ConditionalCheckFailedException)
  })
})
