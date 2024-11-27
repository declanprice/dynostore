import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'

const testTableName = 'test_table'
const testClient: any = mockClient(new DynamoDBClient())
const validTestId = '123'
const invalidTestId = '4444'

describe('ScanItemsBuilder', () => {
  beforeEach(() => {
    testClient.reset()

    // testClient
    //   .on(GetItemCommand, {
    //     Key: {
    //       id: {
    //         S: validTestId
    //       }
    //     }
    //   })
    //   .resolves({
    //     Item: { id: { S: validTestId }, name: { S: 'test' }, age: { N: '25' } }
    //   })
  })
})

