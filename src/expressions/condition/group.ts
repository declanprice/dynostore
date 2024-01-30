import { ConvertConditionExpression } from './convert-condition-expression'

export type GroupExpression = {
  type: 'group'
  conditions: ConvertConditionExpression[]
}

export const group = (...conditions: ConvertConditionExpression[]): GroupExpression => {
  return {
    type: 'group',
    conditions
  }
}
