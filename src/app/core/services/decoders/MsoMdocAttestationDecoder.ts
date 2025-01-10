import {Injectable} from "@angular/core";
import {AttestationDecoder} from "@core/services/decoders/AttestationDecoder";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {decode} from "cbor-x";
import {Buffer} from 'buffer';

import {PresentedAttestation, Single} from "@core/models/presentation/PresentedAttestation";
import {KeyValue} from "@angular/common";
import {elementAsString} from "@core/services/decoders/DecodingUtils";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MsoMdocAttestationDecoder implements AttestationDecoder {

  supports(format: AttestationFormat): boolean {
    return format === AttestationFormat.MSO_MDOC;
  }

  decode(attestation: string, nonce: string): Observable<PresentedAttestation> {
    const buffer = this.decodeBase64OrHex(attestation);
    const decodedData = this.decodeCborData(buffer);
    if (decodedData.documents.length === 1) {
      return of(this.extractAttestationSingle(decodedData.documents[0]))

    } else {
      let attestations: Single[] = decodedData.documents.map((doc: any) => {
        return this.extractAttestationSingle(doc)
      })
      return of({
        kind: "enveloped",
        attestations: attestations
      })
    }
  }

  private extractAttestationSingle(document: any): Single {
    let namespaces = document.issuerSigned.nameSpaces;
    let attributes: KeyValue<string, string>[] = [];

    Object.keys(namespaces).forEach((it: string) => {
      let namespace = namespaces[it]
      for (const element of namespace) {
        const decodedElement = this.decodeCborData(element.value);
        attributes.push({
          key: it + ":" + decodedElement.elementIdentifier,
          value: elementAsString(decodedElement.elementValue)
        });
      }

    })
    return {
      kind: "single",
      format: AttestationFormat.MSO_MDOC,
      name: document["docType"],
      attributes: attributes,
      metadata: []
    };
  }

  public decodeBase64OrHex(input: string): Buffer {
    const base64Regex = /^[A-Za-z0-9-_]+$/;
    if (base64Regex.test(input)) {
      const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
      return Buffer.from(base64, "base64");
    }
    return Buffer.from(input, "hex");
  }

  public decodeCborData(data: Uint8Array): any {
    try {
      return decode(data);
    } catch (error) {
      console.error("Failed to decode CBOR:", error);
      return null;
    }
  }

}
