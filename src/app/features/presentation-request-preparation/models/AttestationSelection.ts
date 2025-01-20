import {AttestationType} from "@core/models/attestation/AttestationType";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";

export type AttestationSelection = {
  type: AttestationType,
  format: AttestationFormat | null,
  attributeSelectionMethod: AttributeSelectionMethod | null
}

export enum AttributeSelectionMethod {
  ALL_ATTRIBUTES = "all_attributes",
  SELECTABLE = "selectable"
}
