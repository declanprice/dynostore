export type RemoveExpression = {
  type: 'remove'
  path: string
}

export const remove = (path: string): RemoveExpression => {
  return {
    type: 'remove',
    path
  }
}
