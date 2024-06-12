export type CBOR = {
  documents: Document[]
  // status: number
  // version: string
}

export type Document = {
  issuerSigned: {
    nameSpaces: {
      'eu.europa.ec.eudi.pid.1': TagValue
    }
  }
}
export type TagValue = {
  tag: number,
  value: Uint8Array,
}
