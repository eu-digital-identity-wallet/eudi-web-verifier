import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {AttestationType} from "@core/models/attestation/AttestationType";

export interface DialogData {
  type: AttestationType,
  format: AttestationFormat,
  attestationName: string,
  seed?: {
    selectedFields: string[]
  }
}
