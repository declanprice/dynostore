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

describe('ConditionExpression', () => {
  it('eq() - should return expected expression', () => {
    const expression = createConditionExpression('test', eq('name', 'declan'))
    expect(expression.expression).toEqual('#test-0 = :test-1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        S: 'declan'
      }
    })
  })

  it('notEq() - should return expected expression', () => {
    const expression = createConditionExpression('test', notEq('name', 'declan'))
    expect(expression.expression).toEqual('#test-0 <> :test-1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        S: 'declan'
      }
    })
  })

  it('gt() - should return expected expression', () => {
    const expression = createConditionExpression('test', gt('age', 25))
    expect(expression.expression).toEqual('#test-0 > :test-1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'age'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        N: '25'
      }
    })
  })

  it('gte() - should return expected expression', () => {
    const expression = createConditionExpression('test', gte('age', 25))
    expect(expression.expression).toEqual('#test-0 >= :test-1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'age'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        N: '25'
      }
    })
  })

  it('lt() - should return expected expression', () => {
    const expression = createConditionExpression('test', lt('age', 25))
    expect(expression.expression).toEqual('#test-0 < :test-1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'age'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        N: '25'
      }
    })
  })

  it('lte() - should return expected expression', () => {
    const expression = createConditionExpression('test', lte('age', 25))
    expect(expression.expression).toEqual('#test-0 <= :test-1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'age'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        N: '25'
      }
    })
  })

  it('beginsWith() - should return expected expression', () => {
    const expression = createConditionExpression('test', beginsWith('name', 'dec'))
    expect(expression.expression).toEqual('begins_with(#test-0, :test-1)')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        S: 'dec'
      }
    })
  })

  it('between() - should return expected expression', () => {
    const expression = createConditionExpression('test', between('year', '2018', '2020'))
    expect(expression.expression).toEqual('#test-0 between :test-1 and :test-2')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'year'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        S: '2018'
      },
      ':test-2': {
        S: '2020'
      }
    })
  })

  it('exists() - should return expected expression', () => {
    const expression = createConditionExpression('test', exists('name'))
    expect(expression.expression).toEqual('attribute_exists(#test-0)')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({})
  })

  it('notExists() - should return expected expression', () => {
    const expression = createConditionExpression('test', notExists('name'))
    expect(expression.expression).toEqual('attribute_not_exists(#test-0)')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({})
  })

  it('contains() - should return expected expression', () => {
    const expression = createConditionExpression('test', contains('year', '2018'))
    expect(expression.expression).toEqual('contains(#test-0, :test-1)')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'year'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        S: '2018'
      }
    })
  })

  it('anyOf() - should return expected expression', () => {
    const expression = createConditionExpression('test', anyOf('year', ['2018', '2019', '2020']))
    expect(expression.expression).toEqual('#test-0 in (:test-1,:test-2,:test-3)')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'year'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        S: '2018'
      },
      ':test-2': {
        S: '2019'
      },
      ':test-3': {
        S: '2020'
      }
    })
  })

  it('type() - should return expected expression', () => {
    const expression = createConditionExpression('test', type('year', 'S'))
    expect(expression.expression).toEqual('attribute_type(#test-0, :test-1)')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'year'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        S: 'S'
      }
    })
  })

  it('size() - should return expected expression', () => {
    const expression = createConditionExpression('test', size('year'))
    expect(expression.expression).toEqual('size(#test-0)')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'year'
    })
    expect(expression.expressionAttributeValues).toEqual({})
  })

  it('and() - should return expected expression', () => {
    const expression = createConditionExpression('test', eq('name', 'declan'), and(), eq('age', 26))
    expect(expression.expression).toEqual('#test-0 = :test-1 and #test-2 = :test-3')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'name',
      '#test-2': 'age'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        S: 'declan'
      },
      ':test-3': {
        N: '26'
      }
    })
  })

  it('or() - should return expected expression', () => {
    const expression = createConditionExpression('test', eq('name', 'declan'), or(), eq('age', 26))
    expect(expression.expression).toEqual('#test-0 = :test-1 or #test-2 = :test-3')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'name',
      '#test-2': 'age'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        S: 'declan'
      },
      ':test-3': {
        N: '26'
      }
    })
  })

  it('not() - should return expected expression', () => {
    const expression = createConditionExpression('test', not(eq('name', 'declan')))
    expect(expression.expression).toEqual('not #test-0 = :test-1')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'name'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        S: 'declan'
      }
    })
  })

  it('group() - should return expected expression', () => {
    const expression = createConditionExpression('test', group(eq('name', 'declan'), or(), eq('age', 26)))
    expect(expression.expression).toEqual('(#test-0 = :test-1 or #test-2 = :test-3)')
    expect(expression.expressionAttributeNames).toEqual({
      '#test-0': 'name',
      '#test-2': 'age'
    })
    expect(expression.expressionAttributeValues).toEqual({
      ':test-1': {
        S: 'declan'
      },
      ':test-3': {
        N: '26'
      }
    })
  })
})
