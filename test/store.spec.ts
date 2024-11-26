import { DynamoDBClient, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import { Store } from '../src'
import 'aws-sdk-client-mock-jest'

const testClient = mockClient(new DynamoDBClient())

describe('TransactWriteItems', () => {

  let testStore: Store

  beforeAll(async () => {
    testClient.reset()
    testStore = new Store('TestTable', testClient as any)
    testClient.on(TransactWriteItemsCommand).resolves({})
  })

  it('transactItems() should submit TransactWriteItemsCommand succesfully', async () => {
    const deleteItemTx = testStore.delete().key({
      pk: 'item',
      sk: '1'
    }).tx()

    const deleteIte2mTx = testStore.delete().key({
      pk: 'item',
      sk: '2'
    }).tx()

    await testStore.transactItems([deleteItemTx, deleteIte2mTx])

    expect(testClient).toHaveReceivedCommandWith(TransactWriteItemsCommand, {
      TransactItems: [
        deleteItemTx,
        deleteIte2mTx
      ]
    })
  })
})