import { createConditionExpression } from '../src/expressions/condition/condition-expression'
import { eq } from '../src/expressions/condition/eq'
import { and } from '../src/expressions/condition/and'
import { or } from '../src/expressions/condition/or'
import { group } from '../src/expressions/condition/group'
import { not } from '../src/expressions/condition/not'
import { gte } from '../src/expressions/condition/gte'
import { gt } from '../src/expressions/condition/gt'
import { lt } from '../src/expressions/condition/lt'
import { lte } from '../src/expressions/condition/lte'
import { beginsWith } from '../src/expressions/condition/beginsWith'
import { exists } from '../src/expressions/condition/exists'
import { notExists } from '../src/expressions/condition/notExists'
import { between } from '../src/expressions/condition/between'
import { contains } from '../src/expressions/condition/contains'
import { anyOf } from '../src/expressions/condition/anyOf'
import { type } from '../src/expressions/condition/type'
import { size } from '../src/expressions/condition/size'
import { notEq } from '../src/expressions/condition/notEq'
import { createUpdateExpression } from '../src/expressions/update/update-expression'
import { set } from '../src/expressions/update/set'
import { decrement } from '../src/expressions/update/decrement'
import { increment } from '../src/expressions/update/increment'
import { del } from '../src/expressions/update/delete'
import { setIfNotExists } from '../src/expressions/update/setIfNotExists'
import { remove } from '../src/expressions/update/remove'
import { add } from '../src/expressions/update/add'

describe('UpdateExpression', () => {
  it('set() - should return expected expression', () => {
    const expression = createUpdateExpression('test', set('name', 'declan'))
    expect(expression.expression).toEqual('SET #test_0 = :test_1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test_0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test_1': {
        S: 'declan'
      }
    })
  })

  it('setIfNotExists() - should return expected expression', () => {
    const expression = createUpdateExpression('test', setIfNotExists('name', 'declan'))
    expect(expression.expression).toEqual('SET #test_0 if_not_exists(#test_0, :test_1)')
    expect(expression.expressionAttributeNames).toEqual({
      '#test_0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test_1': {
        S: 'declan'
      }
    })
  })

  it('decrement() - should return expected expression', () => {
    const expression = createUpdateExpression('test', decrement('name', 'declan'))
    expect(expression.expression).toEqual('SET #test_0 - :test_1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test_0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test_1': {
        S: 'declan'
      }
    })
  })

  it('increment() - should return expected expression', () => {
    const expression = createUpdateExpression('test', increment('name', 'declan'))
    expect(expression.expression).toEqual('SET #test_0 + :test_1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test_0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test_1': {
        S: 'declan'
      }
    })
  })

  it('remove() - should return expected expression', () => {
    const expression = createUpdateExpression('test', remove('name'))
    expect(expression.expression).toEqual('REMOVE #test_0')
    expect(expression.expressionAttributeNames).toEqual({
      '#test_0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({})
  })

  it('add() - should return expected expression', () => {
    const expression = createUpdateExpression('test', add('name', 'declan'))
    expect(expression.expression).toEqual('ADD #test_0 :test_1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test_0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test_1': {
        S: 'declan'
      }
    })
  })

  it('delete() - should return expected expression', () => {
    const expression = createUpdateExpression('test', del('name', 'declan'))
    expect(expression.expression).toEqual('DELETE #test_0 :test_1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test_0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test_1': {
        S: 'declan'
      }
    })
  })

  it('should join multiple update conditions', () => {
    const expression = createUpdateExpression('test', set('age', 25), del('name', 'declan'))
    expect(expression.expression).toEqual('SET #test_0 = :test_1,DELETE #test_2 :test_3')
    expect(expression.expressionAttributeNames).toEqual({
      '#test_0': 'age',
      '#test_2': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test_1': {
        N: '25'
      },
      ':test_3': {
        S: 'declan'
      }
    })
  })
})
