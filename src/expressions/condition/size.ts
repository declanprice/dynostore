import { EqCondition } from './eq'
import { GtCondition } from './gt'
import { LtCondition } from './lt'
import { GteCondition } from './gte'
import { LteCondition } from './lte'
import { BetweenCondition } from './between'

export type SizeCondition = {
  type: 'size'
  condition: EqCondition | GtCondition | LtCondition | GteCondition | LteCondition | BetweenCondition
}

export const size = (condition: EqCondition | GtCondition | LtCondition | GteCondition | LteCondition | BetweenCondition): SizeCondition => {
  return {
    type: 'size',
    condition
  }
}
