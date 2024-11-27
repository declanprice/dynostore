import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import { eq, ScanItemsBuilder } from '../../src'

const testTableName = 'test_table'
const testClient = mockClient(new DynamoDBClient())

describe('ScanItemsBuilder', () => {
  beforeEach(() => {
    testClient.reset()

    testClient
      .on(ScanCommand)
      .resolves({
        Items: [{ id: { S: '1' }, name: { S: 'test' }, age: { N: '25' } }]
      })


  })

  describe('exec()', () => {

    it('should send ScanCommand with configured filter', async () => {
      const builder = new ScanItemsBuilder(testTableName, testClient as any)

      await builder.filter(eq('name', 'declan')).exec()

      expect(testClient).toHaveReceivedCommandWith(ScanCommand, {
        TableName: testTableName,
        IndexName: undefined,
        ConsistentRead: undefined,
        ProjectionExpression: undefined,
        FilterExpression: '#0 = :1',
        ExpressionAttributeNames: {
          '#0': 'name'
        },
        ExpressionAttributeValues: {
          ':1': {
            S: 'declan'
          }
        },
        Limit: undefined,
        ExclusiveStartKey: undefined,
        TotalSegments: undefined,
        Segment: undefined
      })
    })
  })

  it('should send ScanCommand with configured index', async () => {
    const builder = new ScanItemsBuilder(testTableName, testClient as any)

    await builder.filter(eq('name', 'declan')).using('test-index').exec()

    expect(testClient).toHaveReceivedCommandWith(ScanCommand, {
      TableName: testTableName,
      IndexName: 'test-index',
      ConsistentRead: undefined,
      ProjectionExpression: undefined,
      FilterExpression: '#0 = :1',
      ExpressionAttributeNames: {
        '#0': 'name'
      },
      ExpressionAttributeValues: {
        ':1': {
          S: 'declan'
        }
      },
      Limit: undefined,
      ExclusiveStartKey: undefined,
      TotalSegments: undefined,
      Segment: undefined
    })
  })

  it('should send ScanCommand with configured limit', async () => {
    const builder = new ScanItemsBuilder(testTableName, testClient as any)

    await builder.filter(eq('name', 'declan')).limit(10).exec()

    expect(testClient).toHaveReceivedCommandWith(ScanCommand, {
      TableName: testTableName,
      IndexName: undefined,
      ConsistentRead: undefined,
      ProjectionExpression: undefined,
      FilterExpression: '#0 = :1',
      ExpressionAttributeNames: {
        '#0': 'name'
      },
      ExpressionAttributeValues: {
        ':1': {
          S: 'declan'
        }
      },
      Limit: 10,
      ExclusiveStartKey: undefined,
      TotalSegments: undefined,
      Segment: undefined
    })
  })

  it('should send ScanCommand with configured projection', async () => {
    const builder = new ScanItemsBuilder(testTableName, testClient as any)

    await builder.filter(eq('name', 'declan')).project('id,name').exec()

    expect(testClient).toHaveReceivedCommandWith(ScanCommand, {
      TableName: testTableName,
      IndexName: undefined,
      ConsistentRead: undefined,
      ProjectionExpression: 'id,name',
      FilterExpression: '#0 = :1',
      ExpressionAttributeNames: {
        '#0': 'name'
      },
      ExpressionAttributeValues: {
        ':1': {
          S: 'declan'
        }
      },
      Limit: undefined,
      ExclusiveStartKey: undefined,
      TotalSegments: undefined,
      Segment: undefined
    })
  })

  it('should send ScanCommand with configured startAt key', async () => {
    const builder = new ScanItemsBuilder(testTableName, testClient as any)

    await builder.filter(eq('name', 'declan')).startAt({ 'id': '1' }).exec()

    expect(testClient).toHaveReceivedCommandWith(ScanCommand, {
      TableName: testTableName,
      IndexName: undefined,
      ConsistentRead: undefined,
      ProjectionExpression: undefined,
      FilterExpression: '#0 = :1',
      ExpressionAttributeNames: {
        '#0': 'name'
      },
      ExpressionAttributeValues: {
        ':1': {
          S: 'declan'
        }
      },
      Limit: undefined,
      ExclusiveStartKey: {
        id: {
          S: '1'
        }
      },
      TotalSegments: undefined,
      Segment: undefined
    })
  })

  it('should send ScanCommand with configured consistent', async () => {
    const builder = new ScanItemsBuilder(testTableName, testClient as any)

    await builder.filter(eq('name', 'declan')).consistent().exec()

    expect(testClient).toHaveReceivedCommandWith(ScanCommand, {
      TableName: testTableName,
      IndexName: undefined,
      ConsistentRead: true,
      ProjectionExpression: undefined,
      FilterExpression: '#0 = :1',
      ExpressionAttributeNames: {
        '#0': 'name'
      },
      ExpressionAttributeValues: {
        ':1': {
          S: 'declan'
        }
      },
      Limit: undefined,
      ExclusiveStartKey: undefined,
      TotalSegments: undefined,
      Segment: undefined
    })
  })

  it('should send ScanCommand with configured parallel', async () => {
    const builder = new ScanItemsBuilder(testTableName, testClient as any)

    await builder.filter(eq('name', 'declan')).parallel(2, 1).exec()

    expect(testClient).toHaveReceivedCommandWith(ScanCommand, {
      TableName: testTableName,
      IndexName: undefined,
      ConsistentRead: undefined,
      ProjectionExpression: undefined,
      FilterExpression: '#0 = :1',
      ExpressionAttributeNames: {
        '#0': 'name'
      },
      ExpressionAttributeValues: {
        ':1': {
          S: 'declan'
        }
      },
      Limit: undefined,
      ExclusiveStartKey: undefined,
      TotalSegments: 2,
      Segment: 1
    })
  })

  it('should send ScanCommand and return items', async () => {
    testClient
      .on(ScanCommand)
      .resolves({
        Items: [{ id: { S: '1' }, name: { S: 'test' }, age: { N: '25' } }]
      })

    const builder = new ScanItemsBuilder(testTableName, testClient as any)

    const items = await builder.filter(eq('name', 'declan')).exec()

    expect(items.items).toEqual([{ id: '1', name: 'test', age: 25 }])
    expect(items.lastKey).toEqual(null)
  })

  it('should send ScanCommand and return lastKey ', async () => {
    testClient
      .on(ScanCommand)
      .resolves({
        Items: [{ id: { S: '1' }, name: { S: 'test' }, age: { N: '25' } }],
        LastEvaluatedKey: {
          id: {
            S: '1'
          }
        }
      })

    const builder = new ScanItemsBuilder(testTableName, testClient as any)

    const items = await builder.filter(eq('name', 'declan')).exec()

    expect(items.items).toEqual([{ id: '1', name: 'test', age: 25 }])

    expect(items.lastKey).toEqual({
      id: '1'
    })
  })

  it('should send ScanCommand and return empty array is no items are found', async () => {
    testClient
      .on(ScanCommand)
      .resolves({
        Items: undefined
      })

    const builder = new ScanItemsBuilder(testTableName, testClient as any)
    const items = await builder.filter(eq('name', 'declan')).exec()
    expect(items.items).toEqual([])
    expect(items.lastKey).toEqual(null)
  })
})

