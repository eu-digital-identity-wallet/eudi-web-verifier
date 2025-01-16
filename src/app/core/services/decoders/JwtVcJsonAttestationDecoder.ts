import {Injectable} from "@angular/core";
import {AttestationDecoder} from "@core/services/decoders/AttestationDecoder";
import {PresentedAttestation, Single} from "@core/models/presentation/PresentedAttestation";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {JWTService} from "@core/services/jwt.service";
import {KeyValue} from "@angular/common";
import {elementAsString} from "@core/services/decoders/DecodingUtils";
import {Observable, of} from "rxjs";

const TYPE_VerifiableAttestation = "VerifiableAttestation"
const TYPE_VerifiableCredential = "VerifiableCredential"

@Injectable({
  providedIn: 'root'
})
export class JwtVcJsonAttestationDecoder implements AttestationDecoder {

  constructor(
    private readonly jWTService: JWTService,
  ) {
  }

  supports(format: AttestationFormat): boolean {
    return format === AttestationFormat.JWT_VC_JSON;
  }

  decode(attestation: string, nonce: string): Observable<PresentedAttestation> {
    let vp = this.jWTService.decodeToObject(attestation);
    let sharedCredentials = this.unWrapCredentials(vp)

    if (sharedCredentials.length == 1) {
      return of(this.toSinge(sharedCredentials[0]))

    } else {
      let singles = sharedCredentials.map(it => this.toSinge(it));
      return of({
        kind: "enveloped",
        attestations: singles
      })
    }
  }

  toSinge(vcJwt: string): Single {
    let vc = this.jWTService.decodeToObject(vcJwt) as any;
    return {
      kind: "single",
      format: AttestationFormat.JWT_VC_JSON,
      name: this.extractName(vc),
      attributes: this.extractAttributes(vc),
      metadata: this.extractMetadata(vc)
    };
  }

  extractName(vc: any): string {
    let typeAttribute = vc['vc']['type'] as string[];
    return typeAttribute.filter((item) => item !== TYPE_VerifiableCredential && item !== TYPE_VerifiableAttestation)[0];
  }

  unWrapCredentials(vp: any): string[] {
    return vp['vp']['verifiableCredential'] as string[]
  }

  private extractAttributes(vc: any): KeyValue<string, string>[] {
    const result: KeyValue<string, string>[] = [];
    let credentialSubject = vc['vc']['credentialSubject'];
    Object.keys(credentialSubject).forEach((item) => {
      result.push({
        key: item.replaceAll('_', ' '),
        value: elementAsString(credentialSubject[item])
      });
    });
    return result;
  }

  private extractMetadata(vc: any): KeyValue<string, string>[] {
    const result: KeyValue<string, string>[] = [];
    let vcElement = vc['vc'];
    Object.keys(vcElement).forEach((item) => {
      if (item !== "credentialSubject") {
        result.push({
          key: item.replaceAll('_', ' '),
          value: elementAsString(vcElement[item])
        });
      }
    });
    return result;
  }

}
