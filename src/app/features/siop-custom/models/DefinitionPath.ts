export type DefinitionPath = {
  path: string[],
  filter?: filter | undefined,
  intent_to_retain?: boolean | any
}
type filter = {
  type: string;
  const: string;
}
