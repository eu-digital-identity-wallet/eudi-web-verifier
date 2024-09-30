import {Injectable} from "@angular/core";
import {AttestationDecoder} from "@core/services/decoders/AttestationDecoder";
import {AttestationFormat} from "@core/models/AttestationFormat";
import {decode} from "cbor-x";
import {Buffer} from 'buffer';

import {SharedAttestation, Single} from "@core/models/presentation/SharedAttestation";
import {KeyValue} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class MsoMdocAttestationDecoder implements AttestationDecoder {

  supports(format: AttestationFormat): boolean {
    return format === AttestationFormat.MSO_MDOC;
  }

  decode(attestation: string): SharedAttestation {
    const buffer = this.decodeBase64OrHex(attestation);
    const decodedData = this.decodeCborData(buffer);
    if (decodedData.documents.length === 1) {
      return this.extractAttestationSingle(decodedData.documents[0])
    } else {
      let attestations: Single[] = decodedData.documents.map((doc: any) => {
        return this.extractAttestationSingle(doc)
      })
      return {
        kind: "enveloped",
        attestations: attestations
      }
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
          value: this.asString(decodedElement.elementValue)
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
