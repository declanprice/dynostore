import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import { GetItemBuilder } from '../src/builders/get-item-builder'

const testTableName = 'test_table'
const testClient: any = mockClient(new DynamoDBClient())
const validTestId = '123'
const invalidTestId = '4444'

describe('GetItemBuilder', () => {
  beforeEach(() => {
    testClient.reset()

    testClient
      .on(GetItemCommand, {
        Key: {
          id: {
            S: validTestId
          }
        }
      })
      .resolves({
        Item: { id: { S: validTestId }, name: { S: 'test' }, age: { N: '25' } }
      })
      .on(GetItemCommand, {
        Key: {
          id: {
            S: invalidTestId
          }
        }
      })
      .resolves({ Item: undefined })
  })

  it('should send GetItemCommand with configured options', async () => {
    const builder = new GetItemBuilder(testTableName, testClient)

    const item = await builder.key({ id: validTestId }).consistent(true).exec()

    expect(testClient).toHaveReceivedCommandWith(GetItemCommand, {
      TableName: testTableName,
      Key: {
        id: {
          S: validTestId
        }
      },
      ConsistentRead: true
    })

    expect(item).toEqual({ id: validTestId, name: 'test', age: 25 })
  })

  it('should return null if Item is undefined', async () => {
    const builder = new GetItemBuilder(testTableName, testClient)

    const item = await builder.key({ id: invalidTestId }).consistent(true).exec()

    expect(item).toEqual(null)
  })
})

describe('GetItemBuilder - errors', () => {
  it('exec should throw error if key is missing', async () => {
    const builder = new GetItemBuilder(testTableName, testClient)

    await expect(async () => {
      await builder.exec()
    }).rejects.toThrow('[invalid options] - key is missing')
  })

  it('tx() should throw error if key is missing', () => {
    const builder = new GetItemBuilder(testTableName, testClient)

    expect(() => {
      builder.tx()
    }).toThrow('[invalid options] - key is missing')
  })
})
