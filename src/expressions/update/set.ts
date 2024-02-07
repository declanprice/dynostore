import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

export type SetExpression = {
  type: 'set'
  path: string
  value: NativeAttributeValue
}

export const set = (path: string, value: NativeAttributeValue): SetExpression => {
  return {
    type: 'set',
    path,
    value
  }
}
