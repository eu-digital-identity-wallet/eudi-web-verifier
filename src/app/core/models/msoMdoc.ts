export type MsoMdoc = {
  name: string;
  doctype: string,
  namespace: string,
  attributes: Attribute[]
  presentationPurpose: string;
}

export type Attribute = {
  value: string,
  text: string
}
