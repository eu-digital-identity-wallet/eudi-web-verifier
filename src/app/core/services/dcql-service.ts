import { Injectable } from '@angular/core';
import {
  ClaimsQuery,
  CredentialQuery,
  CredentialSetQuery,
  DCQL,
  QueryId,
} from '../models/dcql/DCQL';
import { AttestationFormat } from '../models/attestation/AttestationFormat';
import { AttestationType } from '../models/attestation/AttestationType';
import { getAttestationByFormatAndType } from '../constants/attestations-per-format';
import { EU_PID_CROSS_BORDER_MEMBER_STATES, PID_GENERIC_VCT } from '../constants/cross-border-pid';
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
    return this.getDCQLQuery(selectedAttestations, selectedAttributes).credentials;
  }

  getDCQLQuery(
    selectedAttestations: AttestationSelection[],
    selectedAttributes: { [id: string]: string[] },
  ): DCQL {
    const credentials: CredentialQuery[] = [];
    const credentialSets: CredentialSetQuery[] = [];

    let normalIndex = 0;
    selectedAttestations.forEach((attestation) => {
      if (attestation.type === AttestationType.PID_CROSS_BORDER) {
        const { queries, set } = this.crossBorderPidQuery(
          attestation,
          this.selectedAttributesFor(attestation, selectedAttributes),
        );
        credentials.push(...queries);
        credentialSets.push(set);
      } else {
        credentials.push(
          this.dcqlQueryOf(
            `query_${normalIndex}`,
            attestation.type,
            attestation.format!,
            this.selectedAttributesFor(attestation, selectedAttributes),
          ),
        );
        normalIndex++;
      }
    });

    return {
      credentials,
      credential_sets: credentialSets.length > 0 ? credentialSets : undefined,
    };
  }

  private selectedAttributesFor(
    attestation: AttestationSelection,
    selectedAttributes: { [id: string]: string[] },
  ): string[] | undefined {
    return attestation.attributeSelectionMethod === AttributeSelectionMethod.ALL_ATTRIBUTES ?
      undefined :
      selectedAttributes[attestation.type];
  }

  private crossBorderPidQuery(
    attestation: AttestationSelection,
    selectedAttributes?: string[],
  ): { queries: CredentialQuery[]; set: CredentialSetQuery } {
    const format = attestation.format!;

    const claims = this.claimsFor(
      AttestationType.PID_CROSS_BORDER,
      format,
      selectedAttributes,
    );

    const buildQuery = (id: string, vct: string): CredentialQuery => {
      const query: CredentialQuery = {
        id: id,
        format: format,
        meta: { vct_values: [vct] },
      };
      if (claims.length > 0) {
        query.claims = claims;
      }
      return query;
    };

    const queries: CredentialQuery[] = EU_PID_CROSS_BORDER_MEMBER_STATES.map(
      (state) => buildQuery(`pid_cross_border_${state.code}`, state.vct),
    );
    queries.push(buildQuery('pid_cross_border_generic', PID_GENERIC_VCT));

    const set: CredentialSetQuery = {
      options: queries.map((query) => [query.id]),
      purpose: 'Person Identification Data (PID - cross border)',
      required: true,
    };

    return { queries, set };
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

    let claims: ClaimsQuery[] = this.claimsFor(type, format, selectedAttributes);
    if (claims.length > 0) {
      query.claims = claims;
    }

    return query;
  }

  private claimsFor(
    type: AttestationType,
    format: AttestationFormat,
    selectedAttributes?: string[],
  ): ClaimsQuery[] {
    const attestation = getAttestationByFormatAndType(type, format);
    return attestation!.attestationDef.dataSet
      .filter(
        (dataElement) =>
          selectedAttributes === undefined ||
          selectedAttributes!.includes(dataElement.identifier),
      )
      .flatMap((dataElement) => {
        return attestation!.claimQuery(dataElement);
      });
  }
}
