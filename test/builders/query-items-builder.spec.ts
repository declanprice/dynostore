import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'

const testTableName = 'test_table'
const testClient: any = mockClient(new DynamoDBClient())
const validTestId = '123'
const invalidTestId = '4444'

describe('QueryItemsBuilder', () => {
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
    //   .on(GetItemCommand, {
    //     Key: {
    //       id: {
    //         S: invalidTestId
    //       }
    //     }
    //   })
    //   .resolves({ Item: undefined })
  })

  it('should send GetItemCommand with configured options', async () => {
  })

  it('should return null if Item is undefined', async () => {

  })
})

describe('QueryItemsBuilder - errors', () => {
})
