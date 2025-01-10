import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {PresentedAttestation} from "@core/models/presentation/PresentedAttestation";
import {Observable} from "rxjs";

export interface AttestationDecoder {
  supports(format: AttestationFormat): boolean;
  decode(attestation: string, nonce: string): Observable<PresentedAttestation>
}
