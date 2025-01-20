import {AttestationType} from "@core/models/attestation/AttestationType";
import {InputDescriptor} from "@core/models/presentation/InputDescriptor";

export interface DialogResult {
  attestationType: AttestationType,
  inputDescriptor: InputDescriptor
}
