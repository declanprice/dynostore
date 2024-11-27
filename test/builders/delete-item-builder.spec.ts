import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import { DeleteItemBuilder, eq, or } from '../../src'

const testClient = mockClient(new DynamoDBClient())

describe('DeleteItemBuilder', () => {
  beforeEach(() => {
    testClient.reset()

    testClient
      .on(DeleteItemCommand, {
          Key: {
            pk: {
              S: 'item'
            },
            sk: {
              S: '1'
            }
          },
          ReturnValues: 'NONE'
        }
      )
      .resolves({
        Attributes: undefined
      })

    testClient.on(DeleteItemCommand, {
      Key: {
        pk: {
          S: 'item'
        },
        sk: {
          S: '1'
        }
      },
      ReturnValues: 'ALL_OLD'
    })
      .resolves({
        Attributes: {
          pk: {
            S: 'item'
          },
          sk: {
            S: '1'
          }
        }
      })
  })

  describe('exec()', () => {
    it('should send DeleteItemCommand with configured key', async () => {
      const builder = new DeleteItemBuilder('TestTable', testClient as any)

      await builder.key({
        pk: 'item',
        sk: '1'
      }).exec()

      expect(testClient).toHaveReceivedCommandWith(DeleteItemCommand, {
        Key: {
          pk: {
            S: 'item'
          },
          sk: {
            S: '1'
          }
        },
        ReturnValues: 'NONE'
      })
    })

    it('should send DeleteItemCommand with configured conditions', async () => {
      const builder = new DeleteItemBuilder('TestTable', testClient as any)

      await builder.key({
        pk: 'item',
        sk: '1'
      })
        .condition(eq('name', 'declan'), or(), eq('age', 20))
        .exec()

      expect(testClient).toHaveReceivedCommandWith(DeleteItemCommand, {
        Key: {
          pk: {
            S: 'item'
          },
          sk: {
            S: '1'
          }
        },
        ConditionExpression: '#0 = :1 or #2 = :3',
        ExpressionAttributeNames: {
          '#0': 'name',
          '#2': 'age'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: 'declan'
          },
          ':3': {
            N: '20'
          }
        },
        ReturnValues: 'NONE'
      })
    })

    it('should send DeleteItemCommand with configured stacked conditions', async () => {
      const builder = new DeleteItemBuilder('TestTable', testClient as any)

      const query = builder.key({
        pk: 'item',
        sk: '1'
      })
        .condition(eq('name', 'declan'))

      query.condition(eq('age', 20))

      await query.exec()

      expect(testClient).toHaveReceivedCommandWith(DeleteItemCommand, {
        Key: {
          pk: {
            S: 'item'
          },
          sk: {
            S: '1'
          }
        },
        ConditionExpression: '#0 = :1 and #2 = :3',
        ExpressionAttributeNames: {
          '#0': 'name',
          '#2': 'age'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: 'declan'
          },
          ':3': {
            N: '20'
          }
        },
        ReturnValues: 'NONE'
      })
    })

    it('should send DeleteItemCommand and return value when ReturnValue set as ALL_OLD', async () => {
      const builder = new DeleteItemBuilder('TestTable', testClient as any)

      const result = await builder.key({
        pk: 'item',
        sk: '1'
      })
        .returnOld()
        .exec()

      expect(testClient).toHaveReceivedCommandWith(DeleteItemCommand, {
        Key: {
          pk: {
            S: 'item'
          },
          sk: {
            S: '1'
          }
        },
        ConditionExpression: undefined,
        ReturnValues: 'ALL_OLD'
      })

      expect(result).toEqual({
        pk: 'item',
        sk: '1'
      })
    })

    it('should send DeleteItemCommand and return null when ReturnValue set as NONE', async () => {
      const builder = new DeleteItemBuilder('TestTable', testClient as any)

      const result = await builder.key({
        pk: 'item',
        sk: '1'
      })
        .exec()

      expect(testClient).toHaveReceivedCommandWith(DeleteItemCommand, {
        Key: {
          pk: {
            S: 'item'
          },
          sk: {
            S: '1'
          }
        },
        ConditionExpression: undefined,
        ReturnValues: 'NONE'
      })

      expect(result).toEqual(null)
    })
  })

  describe('tx()', () => {
    it('should return TransactWriteItem with configured DeleteItem', () => {
      const builder = new DeleteItemBuilder('TestTable', testClient as any)

      const txItem = builder.key({
        pk: 'item',
        sk: '1'
      })
        .tx()

      expect(txItem).toEqual({
        ConditionExpression: undefined,
        Delete: {
          TableName: 'TestTable',
          Key: {
            pk: {
              S: 'item'
            },
            sk: {
              S: '1'
            }
          },
          ReturnValuesOnConditionCheckFailure: 'NONE',
          ConditionExpression: undefined,
          ExpressionAttributeNames: undefined,
          ExpressionAttributeValues: undefined
        }
      })
    })

    it('should return TransactWriteItem with ReturnValue set as ALL_OLD', () => {
      const builder = new DeleteItemBuilder('TestTable', testClient as any)

      const txItem = builder.key({
        pk: 'item',
        sk: '1'
      })
        .returnOld()
        .tx()

      expect(txItem).toEqual({
        ConditionExpression: undefined,
        Delete: {
          TableName: 'TestTable',
          Key: {
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
  })

  describe('errors', () => {
    it('exec should throw error if key is missing', async () => {
      const builder = new DeleteItemBuilder('TestTable', testClient as any)

      await expect(async () => {
        await builder.exec()
      }).rejects.toThrow('[InvalidOptions] - key is missing')
    })

    it('tx() should throw error if key is missing', () => {
      const builder = new DeleteItemBuilder('TestTable', testClient as any)

      expect(() => {
        builder.tx()
      }).toThrow('[InvalidOptions] - key is missing')
    })
  })
})


