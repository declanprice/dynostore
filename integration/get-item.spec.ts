import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Store } from '../src/store'
import { wait } from './wait'

const client = new DynamoDBClient()

const tableName = 'TestTable'

const store = new Store(tableName, client)

type CustomerItem = {
  pk: string
  sk: string
  name: string
}

describe('GetItem', () => {
  const customer: CustomerItem = {
    pk: '1',
    sk: 'customer',
    name: 'test'
  }

  beforeAll(async () => {
    await client.send(
      new PutItemCommand({
        TableName: tableName,
        Item: marshall(customer)
      })
    )

    await wait(1000)
  })

  it('should return item successfully', async () => {
    const item = await store.get<CustomerItem>().key({ pk: customer.pk, sk: customer.sk }).exec()
    if (!item) throw new Error('item not found')
    expect(item).toBeTruthy()
    expect(item.pk).toEqual(customer.pk)
    expect(item.sk).toEqual(customer.sk)
    expect(item.name).toEqual(customer.name)
  })

  it('should return item successfully with consistent', async () => {
    const item = await store.get<CustomerItem>().key({ pk: customer.pk, sk: customer.sk }).consistent().exec()
    if (!item) throw new Error('item not found')
    expect(item).toBeTruthy()
    expect(item.pk).toEqual(customer.pk)
    expect(item.sk).toEqual(customer.sk)
    expect(item.name).toEqual(customer.name)
  })
})
