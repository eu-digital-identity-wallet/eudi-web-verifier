export type FormSelectableField = {
  id: number,
  label: string,
  value: string,
  visible?: boolean,
  alwaysDisclosed: boolean,
  nested?: FormSelectableField[]
}
