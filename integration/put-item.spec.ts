import { DeleteItemCommand, DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { Store } from '../src/store'
import { marshall } from '@aws-sdk/util-dynamodb'
import { wait } from './wait'
import { DeleteItemBuilder } from '../src/builders/delete-item-builder'

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
    await wait(100)
    const item = await store.put<CustomerItem>().item(customer).returnOld().exec()
    if (!item) throw new Error('item is null')
    expect(item).toBeTruthy()
    expect(item.pk).toEqual(customer.pk)
  })
})
