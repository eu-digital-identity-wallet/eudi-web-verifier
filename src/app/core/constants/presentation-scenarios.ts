import {PresentationScenario} from "@features/presentation-request-preparation/models/PresentationScenario";
import {AttributeSelectionMethod} from "@features/presentation-request-preparation/models/ScenarioAttestation";
import {AttestationType} from "@core/models/attestation/AttestationType";

export const PID_AUTHENTICATION_SCENARIO: PresentationScenario = {
  name: "PID Authentication",
  attestations: [{
    attestationType: AttestationType.PID,
    attributeSelectionMethods: [AttributeSelectionMethod.SELECTABLE, AttributeSelectionMethod.ALL_ATTRIBUTES]
  }]
}

export const MDL_AUTHENTICATION_SCENARIO: PresentationScenario = {
  name: "MDL Authentication",
  attestations: [{
    attestationType: AttestationType.MDL,
    attributeSelectionMethods: [AttributeSelectionMethod.SELECTABLE, AttributeSelectionMethod.ALL_ATTRIBUTES]
  }]
}

export const AGE_VERIFICATION_SCENARIO: PresentationScenario = {
  name: "Age Verification",
  attestations: [{
    attestationType: AttestationType.AGE_OVER_18,
    attributeSelectionMethods: [AttributeSelectionMethod.SELECTABLE]
  }, {
    attestationType: AttestationType.PID,
    attributeSelectionMethods: [AttributeSelectionMethod.SELECTABLE]
  }]
}

export const MULTIPLE_ATTESTATIONS_SCENARIO: PresentationScenario = {
  name: "Multiple Attestations",
  attestations: [{
    attestationType: AttestationType.AGE_OVER_18,
    attributeSelectionMethods: [AttributeSelectionMethod.SELECTABLE, AttributeSelectionMethod.ALL_ATTRIBUTES]
  }, {
    attestationType: AttestationType.PHOTO_ID,
    attributeSelectionMethods: [AttributeSelectionMethod.SELECTABLE, AttributeSelectionMethod.ALL_ATTRIBUTES]
  }, {
    attestationType: AttestationType.PID,
    attributeSelectionMethods: [AttributeSelectionMethod.SELECTABLE, AttributeSelectionMethod.ALL_ATTRIBUTES]
  }, {
    attestationType: AttestationType.MDL,
    attributeSelectionMethods: [AttributeSelectionMethod.SELECTABLE, AttributeSelectionMethod.ALL_ATTRIBUTES]
  }]
}

export const PRESENTATION_SCENARIOS: PresentationScenario[] = [
 PID_AUTHENTICATION_SCENARIO,
 MDL_AUTHENTICATION_SCENARIO,
 AGE_VERIFICATION_SCENARIO,
 MULTIPLE_ATTESTATIONS_SCENARIO
]
