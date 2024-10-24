import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {AttestationType} from "@core/models/attestation/AttestationType";

export interface DialogData {
  format: AttestationFormat,
  type: AttestationType,
  attestationName: string
}
