import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { convertToAttr } from '@aws-sdk/util-dynamodb'

export class ExpressionAttributes {
  readonly expressionAttributeNames: { [key: string]: string } = {}
  readonly expressionAttributeValues: { [key: string]: AttributeValue } = {}
  private expressionCounter = 0

  constructor(readonly expressionName: string) {}

  addName(name: string): string {
    const exName = `#${this.expressionName}-${this.expressionCounter}`
    this.expressionAttributeNames[exName] = name
    this.expressionCounter++
    return exName
  }

  addValue(value: any): string {
    const exValue = `:${this.expressionName}-${this.expressionCounter}`
    this.expressionAttributeValues[exValue] = convertToAttr(value)
    this.expressionCounter++
    return exValue
  }
}
