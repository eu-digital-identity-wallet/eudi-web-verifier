export type FieldConstraint = {
  path: string[],
  filter?: Filter,
  intent_to_retain?: boolean,
}

export type Filter = {
  type: string,
  contains?: any,
  const?: string
}
