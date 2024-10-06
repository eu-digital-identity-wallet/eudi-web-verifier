import {AttestationType} from "@core/models/attestation/AttestationType";

export type ScenarioAttestation = {
  attestationType: AttestationType,
  attributeSelectionMethods: AttributeSelectionMethod[]
}

export enum AttributeSelectionMethod {
  ALL_ATTRIBUTES = "all_attributes",
  SELECTABLE = "selectable"
}
