import {AttestationType} from "@core/models/attestation/AttestationType";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {AttributeSelectionMethod} from "@features/presentation-request-preparation/models/ScenarioAttestation";

export type ScenarioSelection = {
  selections: AttestationSelection[]
}

export type AttestationSelection = {
  type: AttestationType,
  format: AttestationFormat | null,
  attributeSelectionMethod: AttributeSelectionMethod | null

}
