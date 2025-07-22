import {AttestationType} from "@core/models/attestation/AttestationType";

export interface DialogResult {
  attestationType: AttestationType,
  selectedFields: string[]
}
