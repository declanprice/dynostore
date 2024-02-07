import { DynamoDBClient, TransactWriteItem, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient()

export const transactWriteItems = async (...writes: TransactWriteItem[]) => {
  return await client.send(
    new TransactWriteItemsCommand({
      TransactItems: writes
    })
  )
}
