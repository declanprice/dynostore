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

describe('QueryItems', () => {
  const customers: CustomerItem[] = Array(10).map((i, index) => ({
    pk: `${index}`,
    sk: 'customer',
    name: `test-${index}`
  }))

  it('should return items successfully', () => {})
})
