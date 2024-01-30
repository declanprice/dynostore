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
      ConditionExpression: '#condition_0 = :condition_1 or #condition_2 = :condition_3',
      ExpressionAttributeNames: {
        '#condition_0': 'name',
        '#condition_2': 'age'
      },
      ExpressionAttributeValues: {
        ':condition_1': { S: 'dec' },
        ':condition_3': { N: '25' }
      }
    })
  })
})
