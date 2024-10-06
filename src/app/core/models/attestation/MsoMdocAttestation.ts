import {Attestation} from "@core/models/attestation/Attestation";

export type MsoMdocAttestation = {
  doctype: string,
  namespace: string,
  attestation: Attestation
}
