import { EqCondition } from './eq'
import { GroupExpression } from './group'
import { AndCondition } from './and'
import { OrExpression } from './or'
import { NotCondition } from './not'
import { GteCondition } from './gte'
import { GtCondition } from './gt'
import { LtCondition } from './lt'
import { LteCondition } from './lte'
import { BeginsWithCondition } from './beginsWith'
import { ExistsCondition } from './exists'
import { NotExistsCondition } from './notExists'
import { ContainsCondition } from './contains'
import { NotEqCondition } from './notEq'
import { BetweenCondition } from './between'
import { AnyOfCondition } from './anyOf'
import { SizeCondition } from './size'
import { TypeCondition } from './type'
import { ExpressionAttributes } from '../expression-attributes'
import { Expression } from '../expression'

export type KeyConditionExpression =
  | EqCondition
  | LtCondition
  | LteCondition
  | GtCondition
  | GteCondition
  | BeginsWithCondition
  | BetweenCondition

export type ConditionExpression =
  | GroupExpression
  | AndCondition
  | OrExpression
  | NotCondition
  | EqCondition
  | NotEqCondition
  | GtCondition
  | GteCondition
  | LtCondition
  | LteCondition
  | BeginsWithCondition
  | BetweenCondition
  | ExistsCondition
  | NotExistsCondition
  | ContainsCondition
  | AnyOfCondition
  | SizeCondition
  | TypeCondition

export const createConditionExpression = (
  attributes: ExpressionAttributes,
  ...conditions: ConditionExpression[]
): Expression => {
  let expression = ''

  const applyCondition = (condition: ConditionExpression) => {
    switch (condition.type) {
      case 'group':
        expression += `(`
        for (const groupCondition of condition.conditions) {
          applyCondition(groupCondition)
        }
        expression += `)`
        break
      case 'or':
        expression += ` or `
        break
      case 'and':
        expression += ` and `
        break
      case 'not':
        expression += ` not `
        applyCondition(condition.condition)
        break
      case 'eq':
        const eqName = attributes.addName(condition.path)
        const eqValue = attributes.addValue(condition.value)
        expression += `${eqName} = ${eqValue}`
        break
      case 'notEq':
        const notEqName = attributes.addName(condition.path)
        const notEqValue = attributes.addValue(condition.value)
        expression += `${notEqName} <> ${notEqValue}`
        break
      case 'gt':
        const gtName = attributes.addName(condition.path)
        const gtValue = attributes.addValue(condition.value)
        expression += `${gtName} > ${gtValue}`
        break
      case 'gte':
        const gteName = attributes.addName(condition.path)
        const gteValue = attributes.addValue(condition.value)
        expression += `${gteName} >= ${gteValue}`
        break
      case 'lt':
        const ltName = attributes.addName(condition.path)
        const ltValue = attributes.addValue(condition.value)
        expression += `${ltName} < ${ltValue}`
        break
      case 'lte':
        const lteName = attributes.addName(condition.path)
        const lteValue = attributes.addValue(condition.value)
        expression += `${lteName} <= ${lteValue}`
        break
      case 'beginsWith':
        const bwName = attributes.addName(condition.path)
        const bwValue = attributes.addValue(condition.value)
        expression += `begins_with(${bwName}, ${bwValue})`
        break
      case 'between':
        const betweenName = attributes.addName(condition.path)
        const betweenOneValue = attributes.addValue(condition.valueOne)
        const betweenTwoValue = attributes.addValue(condition.valueTwo)
        expression += `${betweenName} between ${betweenOneValue} and ${betweenTwoValue}`
        break
      case 'exists':
        const existsName = attributes.addName(condition.path)
        expression += `attribute_exists(${existsName})`
        break
      case 'notExists':
        const notExistsName = attributes.addName(condition.path)
        expression += `attribute_not_exists(${notExistsName})`
        break
      case 'contains':
        const containsName = attributes.addName(condition.path)
        const containsValue = attributes.addValue(condition.value)
        expression += `contains(${containsName}, ${containsValue})`
        break
      case 'anyOf':
        const anyOfName = attributes.addName(condition.path)
        const anyOfValues: string[] = []

        for (const value of condition.values) {
          const anyOfValue = attributes.addValue(value)
          anyOfValues.push(anyOfValue)
        }

        expression += `${anyOfName} in (${anyOfValues.join(',')})`

        break
      case 'type':
        const typeName = attributes.addName(condition.path)
        const typeValue = attributes.addValue(condition.value)
        expression += `attribute_type(${typeName}, ${typeValue})`
        break
      case 'size':
        const sizeName = attributes.addName(condition.path)
        expression += `size(${sizeName})`
        break
      default:
        break
    }
  }

  for (const condition of conditions) {
    applyCondition(condition)
  }

  return {
    expression: expression.trim(),
    expressionAttributeNames: attributes.expressionAttributeNames,
    expressionAttributeValues: attributes.expressionAttributeValues
  }
}
