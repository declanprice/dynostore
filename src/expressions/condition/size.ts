import { AttributeValue } from '@aws-sdk/client-dynamodb'

export type SizeCondition = {
  type: 'size'
  path: string
  value: AttributeValue
}

export const size = (path: string, value: AttributeValue): SizeCondition => {
  return {
    type: 'size',
    path,
    value
  }
}
