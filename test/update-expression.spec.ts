import { createUpdateExpression } from '../src/expressions/update/update-expression'
import { set } from '../src/expressions/update/set'
import { decrement } from '../src/expressions/update/decrement'
import { increment } from '../src/expressions/update/increment'
import { del } from '../src/expressions/update/delete'
import { setIfNotExists } from '../src/expressions/update/setIfNotExists'
import { remove } from '../src/expressions/update/remove'
import { add } from '../src/expressions/update/add'
import { ExpressionAttributes } from '../src'

describe('UpdateExpression', () => {
  let attributes: ExpressionAttributes

  beforeEach(() => {
    attributes = new ExpressionAttributes()
  })

  it('set() - should return expected expression', () => {
    const expression = createUpdateExpression(attributes, set('name', 'declan'))
    expect(expression.expression).toEqual('SET #0 = :1')
    expect(expression.expressionAttributeNames).toEqual({
      '#0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':1': {
        S: 'declan'
      }
    })
  })

  it('setIfNotExists() - should return expected expression', () => {
    const expression = createUpdateExpression(attributes, setIfNotExists('name', 'declan'))
    expect(expression.expression).toEqual('SET #0 = if_not_exists(#0, :1)')
    expect(expression.expressionAttributeNames).toEqual({
      '#0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':1': {
        S: 'declan'
      }
    })
  })

  it('decrement() - should return expected expression', () => {
    const expression = createUpdateExpression(attributes, decrement('name', 'declan'))
    expect(expression.expression).toEqual('SET #0 = #0 - :1')
    expect(expression.expressionAttributeNames).toEqual({
      '#0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':1': {
        S: 'declan'
      }
    })
  })

  it('increment() - should return expected expression', () => {
    const expression = createUpdateExpression(attributes, increment('name', 'declan'))
    expect(expression.expression).toEqual('SET #0 = #0 + :1')
    expect(expression.expressionAttributeNames).toEqual({
      '#0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':1': {
        S: 'declan'
      }
    })
  })

  it('remove() - should return expected expression', () => {
    const expression = createUpdateExpression(attributes, remove('name'))
    expect(expression.expression).toEqual('REMOVE #0')
    expect(expression.expressionAttributeNames).toEqual({
      '#0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual(undefined)
  })

  it('add() - should return expected expression', () => {
    const expression = createUpdateExpression(attributes, add('name', 'declan'))
    expect(expression.expression).toEqual('ADD #0 :1')
    expect(expression.expressionAttributeNames).toEqual({
      '#0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':1': {
        S: 'declan'
      }
    })
  })

  it('delete() - should return expected expression', () => {
    const expression = createUpdateExpression(attributes, del('name', 'declan'))
    expect(expression.expression).toEqual('DELETE #0 :1')
    expect(expression.expressionAttributeNames).toEqual({
      '#0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':1': {
        S: 'declan'
      }
    })
  })

  it('should join multiple update conditions', () => {
    const expression = createUpdateExpression(
      attributes,
      set('age', 25),
      set('hobby', 'running'),
      del('name', 'declan')
    )
    expect(expression.expression).toEqual('SET #0 = :1,#2 = :3 DELETE #4 :5')
    expect(expression.expressionAttributeNames).toEqual({
      '#0': 'age',
      '#2': 'hobby',
      '#4': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':1': {
        N: '25'
      },
      ':3': {
        S: 'running'
      },
      ':5': {
        S: 'declan'
      }
    })
  })
})
