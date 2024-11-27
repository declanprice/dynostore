import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import { eq, QueryItemsBuilder } from '../../src'

const testTableName = 'test_table'
const testClient = mockClient(new DynamoDBClient())
const validTestId = '123'

describe('QueryItemsBuilder', () => {
  beforeEach(() => {
    testClient.reset()

    testClient.on(QueryCommand).resolves({
      Items: [
        { id: { S: validTestId }, name: { S: 'test' }, age: { N: '25' } }
      ]
    })
  })

  describe('exec()', () => {
    it('should send QueryCommand with configured pk', async () => {

      const builder = new QueryItemsBuilder(testTableName, testClient as any)

      await builder.pk(eq('id', validTestId)).exec()

      expect(testClient).toHaveReceivedCommandWith(QueryCommand, {
        TableName: testTableName,
        KeyConditionExpression: '#0 = :1',
        ExpressionAttributeNames: {
          '#0': 'id'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: validTestId
          }
        }
      })
    })

    it('should send QueryCommand with configured pk and sk', async () => {
      const builder = new QueryItemsBuilder(testTableName, testClient as any)

      await builder.pk(eq('id', validTestId)).sk(eq('name', 'declan')).exec()

      expect(testClient).toHaveReceivedCommandWith(QueryCommand, {
        TableName: testTableName,
        KeyConditionExpression: '#0 = :1 and #2 = :3',
        ExpressionAttributeNames: {
          '#0': 'id',
          '#2': 'name'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: validTestId
          },
          ':3': {
            S: 'declan'
          }
        },
        FilterExpression: undefined,
        ExclusiveStartKey: undefined,
        Limit: undefined,
        ProjectionExpression: undefined,
        IndexName: undefined,
        ScanIndexForward: true
      })
    })

    it('should send QueryCommand with configured index', async () => {
      const builder = new QueryItemsBuilder(testTableName, testClient as any)

      await builder.pk(eq('id', validTestId)).using('test-index').exec()

      expect(testClient).toHaveReceivedCommandWith(QueryCommand, {
        TableName: testTableName,
        KeyConditionExpression: '#0 = :1',
        ExpressionAttributeNames: {
          '#0': 'id'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: validTestId
          }
        },
        FilterExpression: undefined,
        ExclusiveStartKey: undefined,
        Limit: undefined,
        ProjectionExpression: undefined,
        IndexName: 'test-index',
        ScanIndexForward: true
      })
    })

    it('should send QueryCommand with configured limit', async () => {
      const builder = new QueryItemsBuilder(testTableName, testClient as any)

      await builder.pk(eq('id', validTestId)).limit(10).exec()

      expect(testClient).toHaveReceivedCommandWith(QueryCommand, {
        TableName: testTableName,
        KeyConditionExpression: '#0 = :1',
        ExpressionAttributeNames: {
          '#0': 'id'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: validTestId
          }
        },
        FilterExpression: undefined,
        ExclusiveStartKey: undefined,
        Limit: 10,
        ProjectionExpression: undefined,
        IndexName: undefined,
        ScanIndexForward: true
      })
    })

    it('should send QueryCommand with configured sort direction', async () => {
      const builder = new QueryItemsBuilder(testTableName, testClient as any)

      await builder.pk(eq('id', validTestId)).sort('desc').exec()

      expect(testClient).toHaveReceivedCommandWith(QueryCommand, {
        TableName: testTableName,
        KeyConditionExpression: '#0 = :1',
        ExpressionAttributeNames: {
          '#0': 'id'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: validTestId
          }
        },
        FilterExpression: undefined,
        ExclusiveStartKey: undefined,
        Limit: undefined,
        ProjectionExpression: undefined,
        IndexName: undefined,
        ScanIndexForward: false
      })
    })


    it('should send QueryCommand with configured projection expression', async () => {
      const builder = new QueryItemsBuilder(testTableName, testClient as any)

      await builder.pk(eq('id', validTestId)).project('id').exec()

      expect(testClient).toHaveReceivedCommandWith(QueryCommand, {
        TableName: testTableName,
        KeyConditionExpression: '#0 = :1',
        ExpressionAttributeNames: {
          '#0': 'id'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: validTestId
          }
        },
        FilterExpression: undefined,
        ExclusiveStartKey: undefined,
        Limit: undefined,
        ProjectionExpression: 'id',
        IndexName: undefined,
        ScanIndexForward: true
      })
    })

    it('should send QueryCommand with configured startAt key', async () => {
      const builder = new QueryItemsBuilder(testTableName, testClient as any)

      await builder.pk(eq('id', validTestId)).startAt({ id: '2' }).exec()

      expect(testClient).toHaveReceivedCommandWith(QueryCommand, {
        TableName: testTableName,
        KeyConditionExpression: '#0 = :1',
        ExpressionAttributeNames: {
          '#0': 'id'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: validTestId
          }
        },
        FilterExpression: undefined,
        ExclusiveStartKey: {
          id: {
            S: '2'
          }
        },
        Limit: undefined,
        ProjectionExpression: undefined,
        IndexName: undefined,
        ScanIndexForward: true
      })
    })

    it('should send QueryCommand with configured filter expression', async () => {
      const builder = new QueryItemsBuilder(testTableName, testClient as any)

      await builder.pk(eq('id', validTestId)).filter(eq('name', 'declan')).exec()

      expect(testClient).toHaveReceivedCommandWith(QueryCommand, {
        TableName: testTableName,
        KeyConditionExpression: '#0 = :1',
        ExpressionAttributeNames: {
          '#0': 'id',
          '#2': 'name'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: validTestId
          },
          ':3': {
            S: 'declan'
          }
        },
        FilterExpression: '#2 = :3',
        ExclusiveStartKey: undefined,
        Limit: undefined,
        ProjectionExpression: undefined,
        IndexName: undefined,
        ScanIndexForward: true
      })
    })
  })

  it('should throw error is key is missing', async () => {
    const builder = new QueryItemsBuilder(testTableName, testClient as any)

    expect(async () => {
      await builder.exec()
    }).rejects.toThrow('[InvalidOptions] - pk is missing')
  })
})


