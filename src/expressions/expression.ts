import { AttributeValue } from '@aws-sdk/client-dynamodb'

export type Expression = {
  expression: string
  expressionAttributeNames: { [key: string]: string } | undefined
  expressionAttributeValues: { [key: string]: AttributeValue } | undefined
}
