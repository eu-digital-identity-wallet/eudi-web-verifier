import { TestBed } from '@angular/core/testing';
import { DCQLService } from './dcql-service';
import { AttestationType } from '@core/models/attestation/AttestationType';
import { AttestationFormat } from '@core/models/attestation/AttestationFormat';
import {
  AttestationSelection,
  AttributeSelectionMethod,
} from '@app/features/presentation-request-preparation/models/AttestationSelection';
import { EU_PID_CROSS_BORDER_MEMBER_STATES, PID_GENERIC_VCT } from '@core/constants/cross-border-pid';

describe('DCQLService', () => {
  let service: DCQLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DCQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expand PID place_of_birth into the whole object plus locality, country and region for dc+sd-jwt', () => {
    const selections: AttestationSelection[] = [
      {
        type: AttestationType.PID,
        format: AttestationFormat.SD_JWT_VC,
        attributeSelectionMethod: AttributeSelectionMethod.SELECTABLE,
      },
    ];
    const selectedAttributes = { [AttestationType.PID]: ['place_of_birth'] };

    const queries = service.getDCQLCredentialQueries(selections, selectedAttributes);

    expect(queries.length).toBe(1);
    const claims = queries[0].claims!;
    expect(claims.length).toBe(4);
    expect(claims.map((c) => c.path)).toEqual([
      ['place_of_birth'],
      ['place_of_birth', 'locality'],
      ['place_of_birth', 'country'],
      ['place_of_birth', 'region'],
    ]);
  });

  it('should produce a single claim for other PID attributes in dc+sd-jwt', () => {
    const selections: AttestationSelection[] = [
      {
        type: AttestationType.PID,
        format: AttestationFormat.SD_JWT_VC,
        attributeSelectionMethod: AttributeSelectionMethod.SELECTABLE,
      },
    ];
    const selectedAttributes = { [AttestationType.PID]: ['family_name'] };

    const queries = service.getDCQLCredentialQueries(selections, selectedAttributes);

    const claims = queries[0].claims!;
    expect(claims.length).toBe(1);
    expect(claims[0].path).toEqual(['family_name']);
  });

  it('should request the whole place_of_birth element for mso_mdoc PID', () => {
    const selections: AttestationSelection[] = [
      {
        type: AttestationType.PID,
        format: AttestationFormat.MSO_MDOC,
        attributeSelectionMethod: AttributeSelectionMethod.SELECTABLE,
      },
    ];
    const selectedAttributes = { [AttestationType.PID]: ['place_of_birth'] };

    const queries = service.getDCQLCredentialQueries(selections, selectedAttributes);

    const claims = queries[0].claims!;
    expect(claims.length).toBe(1);
    expect(claims[0].path).toEqual(['eu.europa.ec.eudi.pid.1', 'place_of_birth']);
  });

  it('should produce one optional query per member state plus a generic query and a credential set for cross-border PID', () => {
    const selections: AttestationSelection[] = [
      {
        type: AttestationType.PID_CROSS_BORDER,
        format: AttestationFormat.SD_JWT_VC,
        attributeSelectionMethod: AttributeSelectionMethod.ALL_ATTRIBUTES,
      },
    ];

    const dcql = service.getDCQLQuery(selections, {});

    const expectedCount = EU_PID_CROSS_BORDER_MEMBER_STATES.length + 1;
    expect(dcql.credentials.length).toBe(expectedCount);
    expect(dcql.credential_sets).toBeDefined();
    expect(dcql.credential_sets!.length).toBe(1);

    const set = dcql.credential_sets![0];
    expect(set.required).toBe(true);
    expect(set.options.length).toBe(expectedCount);

    EU_PID_CROSS_BORDER_MEMBER_STATES.forEach((state) => {
      const query = dcql.credentials.find(
        (q) => q.id === `pid_cross_border_${state.code}`,
      )!;
      expect(query).toBeDefined();
      expect(query.format).toBe(AttestationFormat.SD_JWT_VC);
      expect(query.meta).toEqual({ vct_values: [state.vct] });
      expect(set.options).toContain([`pid_cross_border_${state.code}`]);
    });

    const genericQuery = dcql.credentials.find(
      (q) => q.id === 'pid_cross_border_generic',
    )!;
    expect(genericQuery).toBeDefined();
    expect(genericQuery.meta).toEqual({ vct_values: [PID_GENERIC_VCT] });
    expect(set.options).toContain(['pid_cross_border_generic']);
  });

  it('should expand cross-border PID place_of_birth claims per country', () => {
    const selections: AttestationSelection[] = [
      {
        type: AttestationType.PID_CROSS_BORDER,
        format: AttestationFormat.SD_JWT_VC,
        attributeSelectionMethod: AttributeSelectionMethod.SELECTABLE,
      },
    ];
    const selectedAttributes = {
      [AttestationType.PID_CROSS_BORDER]: ['place_of_birth'],
    };

    const dcql = service.getDCQLQuery(selections, selectedAttributes);

    expect(dcql.credentials[0].claims!.map((c) => c.path)).toEqual([
      ['place_of_birth'],
      ['place_of_birth', 'locality'],
      ['place_of_birth', 'country'],
      ['place_of_birth', 'region'],
    ]);
  });

  it('should keep normal query ids and unique ids when mixing cross-border with a normal attestation', () => {
    const selections: AttestationSelection[] = [
      {
        type: AttestationType.PID,
        format: AttestationFormat.SD_JWT_VC,
        attributeSelectionMethod: AttributeSelectionMethod.ALL_ATTRIBUTES,
      },
      {
        type: AttestationType.PID_CROSS_BORDER,
        format: AttestationFormat.SD_JWT_VC,
        attributeSelectionMethod: AttributeSelectionMethod.ALL_ATTRIBUTES,
      },
    ];

    const dcql = service.getDCQLQuery(selections, {});

    const ids = dcql.credentials.map((q) => q.id);
    expect(ids).toContain('query_0');
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should not emit credential_sets when no cross-border attestation is selected', () => {
    const selections: AttestationSelection[] = [
      {
        type: AttestationType.PID,
        format: AttestationFormat.SD_JWT_VC,
        attributeSelectionMethod: AttributeSelectionMethod.ALL_ATTRIBUTES,
      },
    ];

    const dcql = service.getDCQLQuery(selections, {});

    expect(dcql.credential_sets).toBeUndefined();
  });
});
