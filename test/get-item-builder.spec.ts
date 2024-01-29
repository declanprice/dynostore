import {DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import 'aws-sdk-client-mock-jest';
import {GetItemBuilder} from "../src/builders/get-item-builder";

const testTableName = 'test_table';
const testClient: any = mockClient(new DynamoDBClient());
const testId = '123';

describe('GetItemBuilder', () => {

    beforeEach(() => {
        testClient.reset();

        testClient
            .on(GetItemCommand)
            .resolves({
                Item: { id: { S: testId } },
            })
    })

    it('should send GetItemCommand with configured options', async() => {
        const builder = new GetItemBuilder(testTableName, testClient);

        const item = await builder
            .key({id: testId})
            .consistent(true)
            .exec()

        expect(testClient).toHaveReceivedCommandWith(GetItemCommand, {
            TableName: testTableName,
            Key: {
                id: {
                    S: testId
                }
            },
            ConsistentRead: true
        })

        expect(item).toEqual({id: testId })
    })
})


describe('GetItemBuilder - errors', () => {

    it('exec should throw error if key is missing', () => {
        const builder = new GetItemBuilder(testTableName, testClient);

        expect(() => {
            builder.exec();
        }).toThrow('[invalid options] - key is missing')
    })

    it('tx() should throw error if key is missing', () => {
        const builder = new GetItemBuilder(testTableName, testClient);

        expect(() => {
            builder.tx();
        }).toThrow('[invalid options] - key is missing')
    })


})