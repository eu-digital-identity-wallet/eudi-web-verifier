export type MsoMdoc = {
  name: string;
  doctype: string,
  namespace: string,
  attributes: Attribute[]
}

export type Attribute = {
  value: string,
  text: string
}
