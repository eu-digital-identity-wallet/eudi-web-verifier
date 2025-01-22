import { Injectable } from '@angular/core';
import { ClaimsQuery, CredentialQuery, QueryId } from '../models/dcql/DCQL';
import { AttestationFormat } from '../models/attestation/AttestationFormat';
import { AttestationType } from '../models/attestation/AttestationType';
import { getAttestationByFormatAndType } from '../constants/attestations-per-format';

@Injectable({
  providedIn: 'root',
})
export class DCQLService {
  dcqlQueryOf(
    queryId: QueryId,
    type: AttestationType,
    format: AttestationFormat,
    includeAllAttributes: boolean = false
  ): CredentialQuery {
    let attestation = getAttestationByFormatAndType(type, format);

    let claims: ClaimsQuery[] = [];
    if (attestation != null && includeAllAttributes) {
      claims = attestation.attestationDef.dataSet.map((dataElement) => {
        return attestation!!.claimPath(dataElement);
      });
    }

    return {
      id: queryId,
      format: format === AttestationFormat.MSO_MDOC ? 'mso_mdoc' : 'dc+sd-jwt', // TODO add jwt_vc_json
      claims: claims,
    };
  }
}
