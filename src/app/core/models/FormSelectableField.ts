export type FormSelectableField = {
  id: number,
  label: string,
  value: string,
  visible?: boolean,
  alwaysDisclose: boolean,
  nested?: FormSelectableField[]
}
