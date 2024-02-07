import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

export type SetIfNotExistsExpression = {
  type: 'setIfNotExists'
  path: string
  value: NativeAttributeValue
}

export const setIfNotExists = (path: string, value: NativeAttributeValue): SetIfNotExistsExpression => {
  return {
    type: 'setIfNotExists',
    path,
    value
  }
}
