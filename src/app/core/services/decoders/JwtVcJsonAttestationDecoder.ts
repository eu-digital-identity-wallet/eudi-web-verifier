import {Injectable} from "@angular/core";
import {AttestationDecoder} from "@core/services/decoders/AttestationDecoder";
import {SharedAttestation, Single} from "@core/models/presentation/SharedAttestation";
import {AttestationFormat} from "@core/models/AttestationFormat";
import {JWTService} from "@core/services/jwt.service";
import {KeyValue} from "@angular/common";

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

  decode(attestation: string): SharedAttestation {
    let vp = this.jWTService.decodeToObject(attestation);
    let sharedCredentials = this.unWrapCredentials(vp)

    if (sharedCredentials.length == 1) {
      return this.toSinge(sharedCredentials[0])

    } else {
      let singles = sharedCredentials.map(it => this.toSinge(it));
      return {
        kind: "enveloped",
        attestations: singles
      }
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
        value: this.asString(credentialSubject[item])
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
          value: this.asString(vcElement[item])
        });
      }
    });
    return result;
  }

  asString(element: any, prepend?: string): string {
    if ((typeof element) === "object") {

      if (Array.isArray(element)) {
        return (element as string[]).map((it) => {
          return JSON.stringify(it);
        }).join(', ')

      } else {
        let str = ""
        if (typeof prepend !== 'undefined') {
          str += "<br/>"
        } else {
          prepend = ""
        }
        return str + Object.keys(element).map((it) => {
          return prepend + "&nbsp;&nbsp;" + it + ": " + this.asString(element[it], "&nbsp;&nbsp;").toString()
        }).join("<br/>");
      }

    } else {
      return element.toString();
    }
  }
}
