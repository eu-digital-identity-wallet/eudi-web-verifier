import {AttestationDefinition, DataElement} from "@core/models/attestation/AttestationDefinition";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";

export type Attestation = MsoMdocAttestation | SdJwtVcAttestation;

export type MsoMdocAttestation  = {
  format: AttestationFormat.MSO_MDOC,
  doctype: string,
  namespace: string,
  attestationDef: AttestationDefinition,
  attributePath: (attribute: DataElement) => string,
}

export type SdJwtVcAttestation = {
  format: AttestationFormat.SD_JWT_VC,
  vct: string,
  attestationDef: AttestationDefinition
  attributePath: (attribute: DataElement) => string,
}
