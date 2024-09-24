import {AttestationFormat} from "@core/models/AttestationFormat";
import {SharedAttestation} from "@core/models/presentation/shared-attestation";

export interface AttestationDecoder {
  supports(format: AttestationFormat): boolean;
  decode(attestation: string): SharedAttestation
}
