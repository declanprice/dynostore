import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { convertToAttr } from '@aws-sdk/util-dynamodb'

export class ExpressionAttributes {
  expressionAttributeNames: { [key: string]: string } | undefined = undefined
  expressionAttributeValues: { [key: string]: AttributeValue } | undefined = undefined
  private expressionCounter = 0

  constructor() {}

  addName(name: string): string {
    const exName = `#${this.expressionCounter}`
    if (!this.expressionAttributeNames) {
      this.expressionAttributeNames = {}
    }
    this.expressionAttributeNames[exName] = name
    this.expressionCounter++
    return exName
  }

  addValue(value: any): string {
    const exValue = `:${this.expressionCounter}`
    if (!this.expressionAttributeValues) {
      this.expressionAttributeValues = {}
    }
    this.expressionAttributeValues[exValue] = convertToAttr(value)
    this.expressionCounter++
    return exValue
  }
}
