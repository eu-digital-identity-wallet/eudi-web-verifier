import {AttestationDefinition, DataElement} from "@core/models/attestation/AttestationDefinition";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import { ClaimsQuery } from "../dcql/DCQL";

export type Attestation = MsoMdocAttestation | SdJwtVcAttestation;

export type MsoMdocAttestation  = {
  format: AttestationFormat.MSO_MDOC,
  doctype: string,
  namespace: string,
  attestationDef: AttestationDefinition,
  attributePath: (attribute: DataElement) => string,
  claimQuery: (attribute: DataElement) => ClaimsQuery,
}

export type SdJwtVcAttestation = {
  format: AttestationFormat.SD_JWT_VC | AttestationFormat.SD_JWT_VC_DEPRECATED,
  vct: string,
  attestationDef: AttestationDefinition
  attributePath: (attribute: DataElement) => string,
  claimQuery: (attribute: DataElement) => ClaimsQuery,
}
