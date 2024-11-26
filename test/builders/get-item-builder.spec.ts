import { DeleteItemCommand, DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import { GetItemBuilder } from '../../src'

const testTableName = 'test_table'
const testClient = mockClient(new DynamoDBClient())
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

  describe('exec()', () => {
    it('should send GetItemCommand with configured options', async () => {
      const builder = new GetItemBuilder(testTableName, testClient as any)

      const item = await builder.key({ id: validTestId }).exec()

      expect(testClient).toHaveReceivedCommandWith(GetItemCommand, {
        TableName: testTableName,
        Key: {
          id: {
            S: validTestId
          }
        },
        ConsistentRead: undefined
      })

      expect(item).toEqual({ id: validTestId, name: 'test', age: 25 })
    })

    it('should send GetItemCommand with consistent option', async () => {
      const builder = new GetItemBuilder(testTableName, testClient as any)

      const item = await builder.key({ id: validTestId }).consistent().exec()

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

    it('should send GetItemCommand with projected options', async () => {
      const builder = new GetItemBuilder(testTableName, testClient as any)

      const item = await builder.key({ id: validTestId }).project('id,sk').exec()

      expect(testClient).toHaveReceivedCommandWith(GetItemCommand, {
        TableName: testTableName,
        Key: {
          id: {
            S: validTestId
          }
        },
        ConsistentRead: undefined,
        ProjectionExpression: 'id,sk'
      })

      expect(item).toEqual({ id: validTestId, name: 'test', age: 25 })
    })


    it('should send GetItemCommand and return null if item with key is found', async () => {
      const builder = new GetItemBuilder(testTableName, testClient as any)

      const item = await builder.key({ id: invalidTestId }).exec()

      expect(testClient).toHaveReceivedCommandWith(GetItemCommand, {
        Key: {
          id: {
            S: invalidTestId
          },
        },
        ProjectionExpression: undefined,
      })

      expect(item).toEqual(null)
    })
  })

  describe('tx()', () => {
    it('should return TransactGetItem with configured DeleteItem', () => {
      const builder = new GetItemBuilder('TestTable', testClient as any)

      const txItem = builder.key({
        pk: 'item',
        sk: '1'
      })
        .tx()

      expect(txItem).toEqual({
        ConditionExpression: undefined,
        Get: {
          TableName: 'TestTable',
          Key: {
            pk: {
              S: 'item'
            },
            sk: {
              S: '1'
            }
          },
          ConditionExpression: undefined,
          ExpressionAttributeNames: undefined,
          ExpressionAttributeValues: undefined
        }
      })
    })

    it('should return TransactGetItem with ReturnValue set as ALL_OLD', () => {
      const builder = new GetItemBuilder('TestTable', testClient as any)

      const txItem = builder.key({
        pk: 'item',
        sk: '1'
      })
        .tx()

      expect(txItem).toEqual({
        ConditionExpression: undefined,
        Get: {
          TableName: 'TestTable',
          Key: {
            pk: {
              S: 'item'
            },
            sk: {
              S: '1'
            }
          },
          ProjectionExpression: undefined
        }
      })
    })

    it('should return TransactGetItem with projection expression', () => {
      const builder = new GetItemBuilder('TestTable', testClient as any)

      const txItem = builder.key({
        pk: 'item',
        sk: '1'
      })
        .project('pk,sk')
        .tx()

      expect(txItem).toEqual({
        ConditionExpression: undefined,
        Get: {
          TableName: 'TestTable',
          Key: {
            pk: {
              S: 'item'
            },
            sk: {
              S: '1'
            }
          },
          ProjectionExpression: 'pk,sk'
        }
      })
    })
  })

  describe('errors', () => {
    it('exec should throw error if key is missing', async () => {
      const builder = new GetItemBuilder(testTableName, testClient as any)

      await expect(async () => {
        await builder.exec()
      }).rejects.toThrow('[InvalidOptions] - key is missing')
    })

    it('tx() should throw error if key is missing', () => {
      const builder = new GetItemBuilder(testTableName, testClient as any)

      expect(() => {
        builder.tx()
      }).toThrow('[InvalidOptions] - key is missing')
    })
  })
})

