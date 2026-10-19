import { TestBed } from '@angular/core/testing';
import { DCQLService } from './dcql-service';
import { AttestationType } from '@core/models/attestation/AttestationType';
import { AttestationFormat } from '@core/models/attestation/AttestationFormat';
import {
  AttestationSelection,
  AttributeSelectionMethod,
} from '@app/features/presentation-request-preparation/models/AttestationSelection';

describe('DCQLService', () => {
  let service: DCQLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DCQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expand PID place_of_birth into locality, country and region for dc+sd-jwt', () => {
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
    expect(claims.length).toBe(3);
    expect(claims.map((c) => c.path)).toEqual([
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
});
