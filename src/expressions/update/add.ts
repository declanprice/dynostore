import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

export type AddExpression = {
  type: 'add'
  path: string
  value: NativeAttributeValue
}

export const add = (path: string, value: NativeAttributeValue): AddExpression => {
  return {
    type: 'add',
    path,
    value
  }
}
