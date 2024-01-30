import { CreateConditionExpression } from './create-condition-expression'

export type GroupExpression = {
  type: 'group'
  conditions: CreateConditionExpression[]
}

export const group = (...conditions: CreateConditionExpression[]): GroupExpression => {
  return {
    type: 'group',
    conditions
  }
}
