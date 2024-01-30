import { AttributeValue } from '@aws-sdk/client-dynamodb'

export type Expression = {
  expression: string
  expressionAttributeNames: { [key: string]: string }
  expressionAttributeValues: { [key: string]: AttributeValue }
}
