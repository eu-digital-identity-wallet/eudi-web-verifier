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
import {
  AttestationSelection,
  AttributeSelectionMethod,
} from '@app/features/presentation-request-preparation/models/AttestationSelection';
import {
  MsoMdocAttestation,
  SdJwtVcAttestation,
  VctVariant,
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

    const hasAltQueries = selectedAttestations.some(
      (a) => this.altVctsFor(a).length > 0,
    );

    let normalIndex = 0;
    selectedAttestations.forEach((attestation) => {
      const variants = this.altVctsFor(attestation);
      if (variants.length > 0) {
        const { queries, set } = this.altQuerySet(
          attestation,
          variants,
          this.selectedAttributesFor(attestation, selectedAttributes),
        );
        credentials.push(...queries);
        credentialSets.push(set);
      } else {
        const query = this.dcqlQueryOf(
          `query_${normalIndex}`,
          attestation.type,
          attestation.format!,
          this.selectedAttributesFor(attestation, selectedAttributes),
        );
        credentials.push(query);
        if (hasAltQueries) {
          credentialSets.push(this.singleCredentialSet(query.id));
        }
        normalIndex++;
      }
    });

    return {
      credentials,
      credential_sets: credentialSets.length > 0 ? credentialSets : undefined,
    };
  }

  private altVctsFor(attestation: AttestationSelection): VctVariant[] {
    const def = getAttestationByFormatAndType(attestation.type, attestation.format!);
    if (def?.format === AttestationFormat.SD_JWT_VC) {
      return def.altVcts ?? [];
    }
    return [];
  }

  private selectedAttributesFor(
    attestation: AttestationSelection,
    selectedAttributes: { [id: string]: string[] },
  ): string[] | undefined {
    return attestation.attributeSelectionMethod === AttributeSelectionMethod.ALL_ATTRIBUTES ?
      undefined :
      selectedAttributes[attestation.type];
  }

  private altQuerySet(
    attestation: AttestationSelection,
    variants: VctVariant[],
    selectedAttributes?: string[],
  ): { queries: CredentialQuery[]; set: CredentialSetQuery } {
    const format = attestation.format!;
    const claims = this.claimsFor(attestation.type, format, selectedAttributes);

    const queries: CredentialQuery[] = variants.map((variant) => {
      const query: CredentialQuery = {
        id: variant.id,
        format: format,
        meta: { vct_values: [variant.vct] },
      };
      if (claims.length > 0) {
        query.claims = claims;
      }
      return query;
    });

    const set: CredentialSetQuery = {
      options: queries.map((query) => [query.id]),
      required: true,
    };

    return { queries, set };
  }

  private singleCredentialSet(queryId: QueryId): CredentialSetQuery {
    return {
      options: [[queryId]],
      required: true,
    };
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
