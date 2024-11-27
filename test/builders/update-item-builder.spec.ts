import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import { exists, PutItemBuilder, set, UpdateItemBuilder } from '../../src'
import { name } from 'ts-jest/dist/transformers/hoist-jest'

const testTableName = 'test_table'
const testClient = mockClient(new DynamoDBClient())
const validTestId = '123'

describe('UpdateItemBuilder', () => {
  beforeEach(() => {
    testClient.reset()

    testClient
      .on(UpdateItemCommand, {
        Key: {
          id: {
            S: validTestId
          }
        }
      })
      .resolves({
        Attributes: undefined
      })
  })

  describe('exec()', () => {
    it('should send UpdateItemCommand with configured key and update expression', async () => {
      const builder = new UpdateItemBuilder(testTableName, testClient as any)

      await builder.key({
        id: validTestId
      })
        .update(set('name', 'declan'))
        .exec()

      expect(testClient).toHaveReceivedCommandWith(UpdateItemCommand, {
        TableName: testTableName,
        Key: {
          id: {
            S: validTestId
          }
        },
        UpdateExpression: 'SET #0 = :1',
        ExpressionAttributeNames: {
          '#0': 'name'

        },
        ExpressionAttributeValues: {
          ':1': {
            S: 'declan'
          }
        }
      })
    })

    it('should send UpdateItemCommand with configured key and condition expression', async () => {
      const builder = new UpdateItemBuilder(testTableName, testClient as any)

      await builder.key({
        id: validTestId
      })
        .update(set('name', 'declan'))
        .condition(exists('id'))
        .exec()

      expect(testClient).toHaveReceivedCommandWith(UpdateItemCommand, {
        TableName: testTableName,
        Key: {
          id: {
            S: validTestId
          }
        },
        UpdateExpression: 'SET #0 = :1',
        ConditionExpression: 'attribute_exists(#2)',
        ExpressionAttributeNames: {
          '#0': 'name',
          '#2': 'id'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: 'declan'
          }
        },
        ReturnValues: undefined
      })
    })

    it('should send UpdateItemCommand with configured key and return values', async () => {
      const builder = new UpdateItemBuilder(testTableName, testClient as any)

      await builder.key({
        id: validTestId
      })
        .update(set('name', 'declan'))
        .return('ALL_NEW')
        .exec()

      expect(testClient).toHaveReceivedCommandWith(UpdateItemCommand, {
        TableName: testTableName,
        Key: {
          id: {
            S: validTestId
          }
        },
        UpdateExpression: 'SET #0 = :1',
        ExpressionAttributeNames: {
          '#0': 'name'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: 'declan'
          }
        },
        ReturnValues: 'ALL_NEW'
      })
    })

    it('should throw error is key is missing', () => {
      const builder = new UpdateItemBuilder(testTableName, testClient as any)

      expect(async () => {
        await builder.exec()
      }).rejects.toThrow('[InvalidOptions] - key is required')
    })
  })

  describe('tx()', () => {
    it('should return TransactUpdateItem with configured key and update expression', async () => {
      const builder = new UpdateItemBuilder(testTableName, testClient as any)

      const txItem = builder.key({
        id: validTestId
      })
        .update(set('name', 'declan'))
        .tx()

      expect(txItem).toEqual({
        Update: {
          TableName: testTableName,
          Key: {
            id: {
              S: validTestId
            }
          },
          UpdateExpression: 'SET #0 = :1',
          ExpressionAttributeNames: {
            '#0': 'name'

          },
          ExpressionAttributeValues: {
            ':1': {
              S: 'declan'
            }
          }
        }
      })
    })

    it('should return TransactUpdateItem with configured key and condition expression', async () => {
      const builder = new UpdateItemBuilder(testTableName, testClient as any)

      const txItem = builder.key({
        id: validTestId
      })
        .update(set('name', 'declan'))
        .condition(exists('id'))
        .tx()

      expect(txItem).toEqual({
        Update: {
          TableName: testTableName,
          Key: {
            id: {
              S: validTestId
            }
          },
          UpdateExpression: 'SET #0 = :1',
          ConditionExpression: 'attribute_exists(#2)',
          ExpressionAttributeNames: {
            '#0': 'name',
            '#2': 'id'
          },
          ExpressionAttributeValues: {
            ':1': {
              S: 'declan'
            }
          },
          ReturnValuesOnConditionCheckFailure: undefined
        }
      })
    })

    it('should return TransactUpdateItem with configured key and return values', async () => {
      const builder = new UpdateItemBuilder(testTableName, testClient as any)

      const txItem = builder.key({
        id: validTestId
      })
        .update(set('name', 'declan'))
        .return('ALL_OLD')
        .tx()

      expect(txItem).toEqual({
        Update: {
          TableName: testTableName,
          Key: {
            id: {
              S: validTestId
            }
          },
          UpdateExpression: 'SET #0 = :1',
          ExpressionAttributeNames: {
            '#0': 'name'
          },
          ExpressionAttributeValues: {
            ':1': {
              S: 'declan'
            }
          },
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
          ConditionExpression: undefined
        }
      })
    })

    it('should throw error is key is missing', () => {
      const builder = new UpdateItemBuilder(testTableName, testClient as any)

      expect(() => {
        builder.tx()
      }).toThrow('[InvalidOptions] - key is required')
    })

    it('should throw error is update expression is missing', () => {
      const builder = new UpdateItemBuilder(testTableName, testClient as any)

      builder.key({ pk: 'item', sk: '1' })

      expect(() => {
        builder.tx()
      }).toThrow('[InvalidOptions] - update expression is required')
    })

    it('should throw error if invalid ReturnValue is configured', () => {
      const builder = new UpdateItemBuilder(testTableName, testClient as any)

      builder.key({ pk: 'item', sk: '1' }).update(set('name', 'declan')).return('ALL_NEW')

      expect(() => {
        builder.tx()
      }).toThrow('[InvalidOptions] - only ALL_OLD or NONE returnValue is supported for transactions')
    })
  })
})