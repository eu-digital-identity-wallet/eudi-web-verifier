import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {AttestationType} from "@core/models/attestation/AttestationType";
import {InputDescriptor} from "@core/models/presentation/InputDescriptor";

export interface DialogData {
  type: AttestationType,
  format: AttestationFormat,
  attestationName: string,
  seed?: InputDescriptor
}
