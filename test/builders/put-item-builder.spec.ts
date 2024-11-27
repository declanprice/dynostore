import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import { DeleteItemBuilder, eq, GetItemBuilder, or, PutItemBuilder } from '../../src'

const testTableName = 'test_table'
const testClient: any = mockClient(new DynamoDBClient())
const validTestId = '123'

describe('PutItemBuilder', () => {
  beforeEach(() => {
    testClient.reset()

    testClient.on(PutItemCommand).resolves()
  })

  describe('exec()', () => {
    it('should send PutItemCommand with configured item', async () => {
      const builder = new PutItemBuilder(testTableName, testClient)

      await builder.item({ id: validTestId }).exec()

      expect(testClient).toHaveReceivedCommandWith(PutItemCommand, {
        TableName: testTableName,
        Item: {
          id: {
            S: validTestId
          }
        },
        ConditionExpression: undefined,
        ExpressionAttributeNames: undefined,
        ExpressionAttributeValues: undefined
      })
    })

    it('should send PutItemCommand with configured condition', async () => {
      const builder = new PutItemBuilder(testTableName, testClient)

      await builder.item({ id: validTestId }).condition(eq('name', 'dec'), or(), eq('age', 25)).exec()

      expect(testClient).toHaveReceivedCommandWith(PutItemCommand, {
        TableName: testTableName,
        Item: {
          id: {
            S: validTestId
          }
        },
        ConditionExpression: '#0 = :1 or #2 = :3',
        ExpressionAttributeNames: {
          '#0': 'name',
          '#2': 'age'
        },
        ExpressionAttributeValues: {
          ':1': { S: 'dec' },
          ':3': { N: '25' }
        }
      })
    })

    it('should send PutItemCommand with configured stacked conditions', async () => {
      const builder = new PutItemBuilder(testTableName, testClient)

      const query = builder.item({ id: validTestId }).condition(eq('name', 'dec'))

      await query.condition(eq('age', 25)).exec()

      expect(testClient).toHaveReceivedCommandWith(PutItemCommand, {
        TableName: testTableName,
        Item: {
          id: {
            S: validTestId
          }
        },
        ConditionExpression: '#0 = :1 and #2 = :3',
        ExpressionAttributeNames: {
          '#0': 'name',
          '#2': 'age'
        },
        ExpressionAttributeValues: {
          ':1': { S: 'dec' },
          ':3': { N: '25' }
        }
      })
    })

    it('should send PutItemCommand with configured returnValue', async () => {
      const builder = new PutItemBuilder(testTableName, testClient)

      await builder.item({ id: validTestId }).return('ALL_NEW').exec()

      expect(testClient).toHaveReceivedCommandWith(PutItemCommand, {
        TableName: testTableName,
        Item: {
          id: {
            S: validTestId
          }
        },
        ConditionExpression: undefined,
        ReturnValues: 'ALL_NEW',
        ExpressionAttributeNames: undefined,
        ExpressionAttributeValues: undefined
      })
    })

    it('should throw error if item is missing', async () => {
      const builder = new PutItemBuilder(testTableName, testClient as any)

      await expect(async () => {
        await builder.exec()
      }).rejects.toThrow('[InvalidOptions] - item is missing')
    })
  })

  describe('tx()', () => {
    it('should return TransactPutItem with configured PutItem', () => {
      const builder = new PutItemBuilder('TestTable', testClient as any)

      const txItem = builder.item({
        pk: 'item',
        sk: '1'
      })
        .tx()

      expect(txItem).toEqual({
        Put: {
          TableName: 'TestTable',
          Item: {
            pk: {
              S: 'item'
            },
            sk: {
              S: '1'
            }
          },
          ReturnValuesOnConditionCheckFailure: undefined,
          ConditionExpression: undefined,
          ExpressionAttributeNames: undefined,
          ExpressionAttributeValues: undefined
        }
      })
    })

    it('should return TransactPutItem with configured condition', () => {
      const builder = new PutItemBuilder('TestTable', testClient as any)

      const txItem = builder.item({
        pk: 'item',
        sk: '1'
      })
        .condition(eq('name', 'dec'), or(), eq('age', 25))
        .tx()

      expect(txItem).toEqual({
        Put: {
          TableName: 'TestTable',
          Item: {
            pk: {
              S: 'item'
            },
            sk: {
              S: '1'
            }
          },
          ReturnValuesOnConditionCheckFailure: undefined,
          ConditionExpression: '#0 = :1 or #2 = :3',
          ExpressionAttributeNames: {
            '#0': 'name',
            '#2': 'age'
          },
          ExpressionAttributeValues: {
            ':1': { S: 'dec' },
            ':3': { N: '25' }
          }
        }
      })
    })

    it('should return TransactPutItem with ReturnValues set as ALL_OLD', () => {
      const builder = new PutItemBuilder('TestTable', testClient as any)

      const txItem = builder.item({
        pk: 'item',
        sk: '1'
      })
        .return('ALL_OLD')
        .tx()

      expect(txItem).toEqual({
        Put: {
          TableName: 'TestTable',
          Item: {
            pk: {
              S: 'item'
            },
            sk: {
              S: '1'
            }
          },
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
          ConditionExpression: undefined,
          ExpressionAttributeNames: undefined,
          ExpressionAttributeValues: undefined
        }
      })
    })

    it('should throw error if item is missing', () => {
      const builder = new PutItemBuilder(testTableName, testClient as any)

      expect(() => {
        builder.tx()
      }).toThrow('[InvalidOptions] - item is missing')
    })

    it('should throw error if invalid ReturnValue option is configured', () => {
      const builder = new PutItemBuilder(testTableName, testClient as any)

      builder.item({ pk: 'item', sk: '1' }).return('ALL_NEW')

      expect(() => {
        builder.tx()
      }).toThrow('[InvalidOptions] - only ALL_OLD or NONE returnValue is supported for transactions')
    })
  })
})
