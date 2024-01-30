import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

export type DecrementExpression = {
  type: 'decrement'
  path: string
  value: NativeAttributeValue
}

export const decrement = (path: string, value: NativeAttributeValue): DecrementExpression => {
  return {
    type: 'decrement',
    path,
    value
  }
}
