import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

export type DeleteExpression = {
  type: 'delete'
  path: string
  value: NativeAttributeValue
}

export const del = (path: string, value: NativeAttributeValue): DeleteExpression => {
  return {
    type: 'delete',
    path,
    value
  }
}
