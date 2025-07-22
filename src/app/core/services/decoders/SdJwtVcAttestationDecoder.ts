import {Injectable} from "@angular/core";
import {AttestationDecoder} from "@core/services/decoders/AttestationDecoder";
import {PresentedAttestation} from "@core/models/presentation/PresentedAttestation";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {KeyValue} from "@angular/common";
import {elementAsString} from "@core/services/decoders/DecodingUtils";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SdJwtVcAttestationDecoder implements AttestationDecoder {

  constructor(
    private readonly verifierEndpointService: VerifierEndpointService,
  ) {
  }

  supports(format: AttestationFormat): boolean {
    return format === AttestationFormat.SD_JWT_VC;
  }

  decode(attestation: string, nonce: string): Observable<PresentedAttestation> {
    return this.verifierEndpointService.validateSdJwtVc(attestation, nonce)
      .pipe(
        map( (sdJwtVc: any) => {
          return {
            kind: "single",
            format: AttestationFormat.SD_JWT_VC,
            name: sdJwtVc[`vct`],
            attributes: this.extractAttributes(sdJwtVc),
            metadata: []
          };
        })
      );
  }

  private extractAttributes(sdJwtVc: any): KeyValue<string, string>[] {
    const result: KeyValue<string, string>[] = [];
    Object.keys(sdJwtVc).forEach((item) => {
      result.push({
        key: item.replaceAll('_', ' '),
        value: elementAsString(sdJwtVc[item])
      });
    });
    return result;
  }
}
