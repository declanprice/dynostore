import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

export type IncrementExpression = {
  type: 'increment'
  path: string
  value: NativeAttributeValue
}

export const increment = (path: string, value: NativeAttributeValue): IncrementExpression => {
  return {
    type: 'increment',
    path,
    value
  }
}
