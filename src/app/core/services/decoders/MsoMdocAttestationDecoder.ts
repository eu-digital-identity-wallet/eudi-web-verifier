import {Injectable} from "@angular/core";
import {AttestationDecoder} from "@core/services/decoders/AttestationDecoder";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";

import {PresentedAttestation, Single} from "@core/models/presentation/PresentedAttestation";
import {KeyValue} from "@angular/common";
import {elementAsString} from "@core/services/decoders/DecodingUtils";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {MsoMdocDocument, VerifierEndpointService} from "@core/services/verifier-endpoint.service";

@Injectable({
  providedIn: 'root'
})
export class MsoMdocAttestationDecoder implements AttestationDecoder {

  constructor(
    private readonly verifierEndpointService: VerifierEndpointService,
  ) {
  }

  supports(format: AttestationFormat): boolean {
    return format === AttestationFormat.MSO_MDOC;
  }

  decode(attestation: string, _nonce: string, _origin?: string): Observable<PresentedAttestation> {
    return this.verifierEndpointService.validateMsoMdocDeviceResponse(attestation)
      .pipe(
        map((documents: MsoMdocDocument[]) => {
          const singles = documents.map((document) => this.toSingle(document));
          return singles.length === 1 ? singles[0] : {kind: "enveloped", attestations: singles};
        })
      );
  }

  private toSingle(document: MsoMdocDocument): Single {
    const attributes: KeyValue<string, string>[] = [];
    Object.entries(document.attributes ?? {}).forEach(([namespace, values]) => {
      Object.entries(values).forEach(([elementIdentifier, elementValue]) => {
        attributes.push({
          key: `${namespace}:${elementIdentifier}`,
          value: elementAsString(elementValue)
        });
      });
    });
    return {
      kind: "single",
      format: AttestationFormat.MSO_MDOC,
      name: document.docType,
      attributes: attributes,
      metadata: []
    };
  }

}
