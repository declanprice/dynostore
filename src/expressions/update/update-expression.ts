import { Expression } from '../expression'
import { ExpressionAttributes } from '../expression-attributes'
import { AddExpression } from './add'
import { DecrementExpression } from './decrement'
import { IncrementExpression } from './increment'
import { SetIfNotExistsExpression } from './setIfNotExists'
import { RemoveExpression } from './remove'
import { SetExpression } from './set'
import { DeleteExpression } from './delete'

export type UpdateExpression =
  | AddExpression
  | DecrementExpression
  | DeleteExpression
  | IncrementExpression
  | SetIfNotExistsExpression
  | RemoveExpression
  | SetExpression

export const createUpdateExpression = (
  attributes: ExpressionAttributes,
  ...updates: UpdateExpression[]
): Expression => {
  let setExpressions: string[] = []
  let removeExpressions: string[] = []
  let addExpressions: string[] = []
  let deleteExpressions: string[] = []

  for (const update of updates) {
    switch (update.type) {
      case 'set':
        const setName = attributes.addName(update.path)
        const setValue = attributes.addValue(update.value)
        setExpressions.push(`${setName} = ${setValue}`)
        break
      case 'setIfNotExists':
        const ifNotExistsName = attributes.addName(update.path)
        const ifNotExistsValue = attributes.addValue(update.value)
        setExpressions.push(`${ifNotExistsName} = if_not_exists(${ifNotExistsName}, ${ifNotExistsValue})`)
        break
      case 'increment':
        const incrementName = attributes.addName(update.path)
        const incrementValue = attributes.addValue(update.value)
        setExpressions.push(`${incrementName} = ${incrementName} + ${incrementValue}`)
        break
      case 'decrement':
        const decrementName = attributes.addName(update.path)
        const decrementValue = attributes.addValue(update.value)
        setExpressions.push(`${decrementName} = ${decrementName} - ${decrementValue}`)
        break
      case 'remove':
        const removeName = attributes.addName(update.path)
        removeExpressions.push(`${removeName}`)
        break
      case 'add':
        const addName = attributes.addName(update.path)
        const addValue = attributes.addValue(update.value)
        addExpressions.push(`${addName} ${addValue}`)
        break
      case 'delete':
        const deleteName = attributes.addName(update.path)
        const deleteValue = attributes.addValue(update.value)
        deleteExpressions.push(`${deleteName} ${deleteValue}`)
        break
      default:
        break
    }
  }

  let joinedExpressions = []

  if (setExpressions.length) joinedExpressions.push(`SET ${setExpressions.join(',')}`)
  if (removeExpressions.length) joinedExpressions.push(`REMOVE ${removeExpressions.join(',')}`)
  if (addExpressions.length) joinedExpressions.push(`ADD ${addExpressions.join(',')}`)
  if (deleteExpressions.length) joinedExpressions.push(`DELETE ${deleteExpressions.join(',')}`)

  return {
    expression: joinedExpressions.join(' ').trim(),
    expressionAttributeNames: attributes.expressionAttributeNames,
    expressionAttributeValues: attributes.expressionAttributeValues
  }
}
