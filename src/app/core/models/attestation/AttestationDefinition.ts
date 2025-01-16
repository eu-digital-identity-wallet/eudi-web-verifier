import {AttestationType} from "@core/models/attestation/AttestationType";

export type AttestationDefinition = {
  type: AttestationType,
  name: string,
  dataSet: DataElement[]
}

export type DataElement = {
  identifier: string,
  attribute: string,
  description?: string,
}
