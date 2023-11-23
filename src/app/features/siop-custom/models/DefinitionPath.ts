export type DefinitionPath = {
  path: string[],
  filter?: FilterModel,
  intent_to_retain?: boolean | any,
}
export type FilterModel = {
  type: string;
  const: string;
}
