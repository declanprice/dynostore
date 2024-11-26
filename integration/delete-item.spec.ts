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

describe('DeleteItem', () => {
  const customer: CustomerItem = {
    pk: '1',
    sk: 'customer',
    name: 'test'
  }

  beforeAll(async () => {
    // await client.send(
    //   new PutItemCommand({
    //     TableName: tableName,
    //     Item: marshall(customer)
    //   })
    // )
    //
    // await wait(1000)
  })

  it('should return item successfully', async () => {

  })

  it('should return item successfully with consistent', async () => {

  })
})
