import { Injectable } from '@angular/core';
import { ClaimsQuery, CredentialQuery, QueryId } from '../models/dcql/DCQL';
import { AttestationFormat } from '../models/attestation/AttestationFormat';
import { AttestationType } from '../models/attestation/AttestationType';
import { getAttestationByFormatAndType } from '../constants/attestations-per-format';
import {
  AttestationSelection,
  AttributeSelectionMethod,
} from '@app/features/presentation-request-preparation/models/AttestationSelection';
import {
  MsoMdocAttestation,
  SdJwtVcAttestation,
} from '../models/attestation/Attestations';

@Injectable({
  providedIn: 'root',
})
export class DCQLService {

  getDCQLCredentialQueries(
    selectedAttestations: AttestationSelection[],
    selectedAttributes: { [id: string]: string[] },
  ): CredentialQuery[] {
    return selectedAttestations.map((attestation, index) =>
      this.dcqlQueryOf(
        `query_${index}`,
        attestation.type,
        attestation.format!,
        attestation.attributeSelectionMethod ===
          AttributeSelectionMethod.ALL_ATTRIBUTES
          ? undefined
          : selectedAttributes[attestation.type],
      ),
    );
  }

  private dcqlQueryOf(
    queryId: QueryId,
    type: AttestationType,
    format: AttestationFormat,
    selectedAttributes?: string[],
  ): CredentialQuery {
    let attestation = getAttestationByFormatAndType(type, format);

    let query: CredentialQuery = {
      id: queryId,
      format: format,
      meta:
        format === AttestationFormat.MSO_MDOC
          ? {
              doctype_value: (attestation as MsoMdocAttestation).doctype,
            }
          : {
              vct_values: [(attestation as SdJwtVcAttestation).vct],
            },
    };

    let claims: ClaimsQuery[] = [];
    claims = attestation!.attestationDef.dataSet
      .filter(
        (dataElement) =>
          selectedAttributes === undefined ||
          selectedAttributes!.includes(dataElement.identifier),
      )
      .map((dataElement) => {
        return attestation!.claimQuery(dataElement);
      });

    if (claims.length > 0) {
      query.claims = claims;
    }

    return query;
  }
}
