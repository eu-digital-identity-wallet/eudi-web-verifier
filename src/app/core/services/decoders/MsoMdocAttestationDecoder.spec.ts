import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MsoMdocAttestationDecoder } from './MsoMdocAttestationDecoder';
import { MsoMdocDocument, VerifierEndpointService } from '@core/services/verifier-endpoint.service';
import { AttestationFormat } from '@core/models/attestation/AttestationFormat';

describe('MsoMdocAttestationDecoder', () => {
  let decoder: MsoMdocAttestationDecoder;
  let verifierEndpointServiceSpy: jasmine.SpyObj<VerifierEndpointService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('VerifierEndpointService', ['validateMsoMdocDeviceResponse']);
    TestBed.configureTestingModule({
      providers: [
        MsoMdocAttestationDecoder,
        { provide: VerifierEndpointService, useValue: spy },
      ],
    });
    decoder = TestBed.inject(MsoMdocAttestationDecoder);
    verifierEndpointServiceSpy = TestBed.inject(
      VerifierEndpointService
    ) as jasmine.SpyObj<VerifierEndpointService>;
  });

  it('should be created', () => {
    expect(decoder).toBeTruthy();
  });

  it('should support only MSO_MDOC format', () => {
    expect(decoder.supports(AttestationFormat.MSO_MDOC)).toBeTrue();
    expect(decoder.supports(AttestationFormat.SD_JWT_VC)).toBeFalse();
    expect(decoder.supports(AttestationFormat.JWT_VC_JSON)).toBeFalse();
  });

  it('should validate the device response through the verifier endpoint', (done) => {
    verifierEndpointServiceSpy.validateMsoMdocDeviceResponse.and.returnValue(of([]));

    decoder.decode('deviceResponse', 'nonce').subscribe(() => {
      expect(verifierEndpointServiceSpy.validateMsoMdocDeviceResponse).toHaveBeenCalledWith('deviceResponse');
      done();
    });
  });

  it('should decode a single document into a Single attestation', (done) => {
    verifierEndpointServiceSpy.validateMsoMdocDeviceResponse.and.returnValue(of([
      {
        docType: 'eu.europa.ec.eudi.pid.1',
        attributes: {
          'eu.europa.ec.eudi.pid.1': {
            family_name: 'Nea',
            age_over_18: true,
          },
        },
      },
    ]));

    decoder.decode('deviceResponse', 'nonce').subscribe((result) => {
      expect(result.kind).toBe('single');
      if (result.kind === 'single') {
        expect(result.format).toBe(AttestationFormat.MSO_MDOC);
        expect(result.name).toBe('eu.europa.ec.eudi.pid.1');
        expect(result.attributes).toEqual([
          { key: 'eu.europa.ec.eudi.pid.1:family_name', value: 'Nea' },
          { key: 'eu.europa.ec.eudi.pid.1:age_over_18', value: 'true' },
        ]);
      }
      done();
    });
  });

  it('should decode multiple documents into an enveloped attestation', (done) => {
    const documents: MsoMdocDocument[] = [
      { docType: 'eu.europa.ec.eudi.pid.1', attributes: { 'eu.europa.ec.eudi.pid.1': { family_name: 'Nea' } } },
      { docType: 'org.iso.18013.5.1.mDL', attributes: { 'org.iso.18013.5.1': { given_name: 'John' } } },
    ];
    verifierEndpointServiceSpy.validateMsoMdocDeviceResponse.and.returnValue(of(documents));

    decoder.decode('deviceResponse', 'nonce').subscribe((result) => {
      expect(result.kind).toBe('enveloped');
      if (result.kind === 'enveloped') {
        expect(result.attestations.length).toBe(2);
        expect(result.attestations[0].name).toBe('eu.europa.ec.eudi.pid.1');
        expect(result.attestations[1].attributes).toEqual([
          { key: 'org.iso.18013.5.1:given_name', value: 'John' },
        ]);
      }
      done();
    });
  });
});
