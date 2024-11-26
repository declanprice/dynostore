import { PutItemBuilder } from '../src/builders/put-item-builder'
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import { eq } from '../src/expressions/condition/eq'
import { or } from '../src/expressions/condition/or'

const testTableName = 'test_table'
const testClient: any = mockClient(new DynamoDBClient())
const validTestId = '123'
const invalidTestId = '4444'

describe('PutItemBuilder', () => {
  beforeEach(() => {
    testClient.reset()

    testClient.on(PutItemCommand).resolves()
  })

  it('should send PutItemCommand with configured options', async () => {
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

  it('should be able to stack conditions', async () => {
  })
})
