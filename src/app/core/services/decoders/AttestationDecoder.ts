import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {PresentedAttestation} from "@core/models/presentation/PresentedAttestation";

export interface AttestationDecoder {
  supports(format: AttestationFormat): boolean;
  decode(attestation: string): PresentedAttestation
}
