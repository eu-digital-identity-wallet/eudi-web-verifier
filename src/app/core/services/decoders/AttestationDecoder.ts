import {AttestationFormat} from "@core/models/AttestationFormat";
import {SharedAttestation} from "@core/models/presentation/SharedAttestation";

export interface AttestationDecoder {
  supports(format: AttestationFormat): boolean;
  decode(attestation: string): SharedAttestation
}
