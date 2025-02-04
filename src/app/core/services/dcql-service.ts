import { Injectable } from '@angular/core';
import { ClaimsQuery, CredentialQuery, QueryId } from '../models/dcql/DCQL';
import { AttestationFormat } from '../models/attestation/AttestationFormat';
import { AttestationType } from '../models/attestation/AttestationType';
import { getAttestationByFormatAndType } from '../constants/attestations-per-format';
import {
  AttestationSelection,
  AttributeSelectionMethod,
} from '@app/features/presentation-request-preparation/models/AttestationSelection';
import { v4 as uuidv4 } from 'uuid';
import { DCQLTransactionRequest } from '../models/TransactionInitializationRequest';

@Injectable({
  providedIn: 'root',
})
export class DCQLService {
  dcqlPresentationRequest(
    selectedAttestations: AttestationSelection[],
    selectedAttributes: { [id: string]: string[] }
  ): DCQLTransactionRequest {
    let dcqlQueries: CredentialQuery[] = [];

    selectedAttestations.map((attestation, index) => {
      const selectedAttributesForAttestation =
        selectedAttributes[attestation.type];

      const dcqlQuery = this.dcqlQueryOf(
        `query_${index}`,
        attestation.type,
        attestation.format!!,
        attestation.attributeSelectionMethod ===
          AttributeSelectionMethod.ALL_ATTRIBUTES
          ? undefined
          : selectedAttributesForAttestation
      );
      if (dcqlQuery) {
        dcqlQueries.push(dcqlQuery);
      }
    });

    return {
      type: 'vp_token',
      dcql_query: {
        credentials: dcqlQueries!,
      },
      nonce: uuidv4(),
    };
  }

  dcqlQueryOf(
    queryId: QueryId,
    type: AttestationType,
    format: AttestationFormat,
    selectedAttributes?: string[]
  ): CredentialQuery {
    let attestation = getAttestationByFormatAndType(type, format);

    let claims: ClaimsQuery[] = [];
    if (attestation != null) {
      claims = attestation.attestationDef.dataSet
        .filter(
          (dataElement) =>
            selectedAttributes === undefined ||
            selectedAttributes.includes(dataElement.identifier)
        )
        .map((dataElement) => {
          return attestation!!.claimPath(dataElement);
        });
    }

    return {
      id: queryId,
      format: format === AttestationFormat.MSO_MDOC ? 'mso_mdoc' : 'dc+sd-jwt',
      claims: claims,
    };
  }
}
