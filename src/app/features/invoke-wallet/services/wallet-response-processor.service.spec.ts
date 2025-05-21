import { TestBed } from '@angular/core/testing';
import { WalletResponseProcessorService } from './wallet-response-processor.service';
import { DecodersRegistryService } from '@core/services/decoders-registry.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ConcludedTransaction } from '@core/models/ConcludedTransaction';
import { AttestationFormat } from '@core/models/attestation/AttestationFormat';

describe('WalletResponseProcessorService', () => {
  let service: WalletResponseProcessorService;
  let decodersRegistryServiceSpy: jasmine.SpyObj<DecodersRegistryService>;

  beforeEach(() => {
    const decodersSpy = jasmine.createSpyObj('DecodersRegistryService', [
      'decoderOf',
    ]);

    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        WalletResponseProcessorService,
        { provide: DecodersRegistryService, useValue: decodersSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });

    service = TestBed.inject(WalletResponseProcessorService);
    decodersRegistryServiceSpy = TestBed.inject(
      DecodersRegistryService
    ) as jasmine.SpyObj<DecodersRegistryService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapVpTokenToAttestations', () => {
    describe('presentation exchange', () => {
      it('should map VP token to mso mdoc attestations', (done) => {
        const mockConcludedTransaction: ConcludedTransaction = {
          transactionId: 'mockTransactionId',
          nonce: 'mockNonce',
          presentationQuery: {
            id: '85d62545-4b4c-45e1-843e-b816b4094695',
            input_descriptors: [
              {
                id: 'eu.europa.ec.eudi.pid.1',
                format: {
                  mso_mdoc: {
                    alg: ['ES256'],
                  },
                },
                constraints: {
                  limit_disclosure: 'required',
                  fields: [
                    {
                      path: ["$['eu.europa.ec.eudi.pid.1']['family_name']"],
                      intent_to_retain: false,
                    },
                    {
                      path: ["$['eu.europa.ec.eudi.pid.1']['given_name']"],
                      intent_to_retain: false,
                    },
                  ],
                },
              },
            ],
          },
          walletResponse: {
            vp_token: [
              'o2d2ZXJzaW9uYzEuMGlkb2N1bWVudHOCo2dkb2NUeXBld2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xbGlzc3VlclNpZ25lZKJqbmFtZVNwYWNlc6F3ZXUuZXVyb3BhLmVjLmV1ZGkucGlkLjGB2BhYU6RoZGlnZXN0SUQBZnJhbmRvbVDLOKt7d-Qv5sfsfZLl6ZY_cWVsZW1lbnRJZGVudGlmaWVya2ZhbWlseV9uYW1lbGVsZWxlbWVudFZhbHVlZE5lYWxqaXNzdWVyQXV0GiEQ6EBJqEYIVkDMTCCAy0wggKyoAMCAQICFC_LOU7Ot-ZOjoa0RTJbEkQEmKOmMAoGCCqGSM49BAMCMFwxHjAcBgNVBAMMFVBJRCBJc3N1ZXIgQ0EgLSBVVCAwMTEtMCsGA1UECgwkRVVESSBXYWxsZXQgUmVmZXJlbmNlIEltcGxlbWVudGF0aW9uMQswCQYDVQQGEwJVVDAeFw0yNDExMjkxMTI4MzVaFw0yNjExMjkxMTI4MzRaMGkxHTAbBgNVBAMMFEVVREkgUmVtb3RlIFZlcmlmaWVyMQwwCgYDVQQFEwMwMDExLTArBgNVBAoMJEVVREkgV2FsbGV0IFJlZmVyZW5jZSBJbXBsZW1lbnRhdGlvbjELMAkGA1UEBhMCVVQwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQFmvVGq-6D9WWxhW7BQOIN9T8zRmXMIdr0ezwpJNGIgC-HIa7JYPXI9ZAcp8mYu52a2IDzie8dGrURXZMX147Qo4IBQzCCAT8wDAYDVR0TAQH_BAIwADAfBgNVHSMEGDAWgBSzbLiRFxzXpBpmMYdC4YvAQMyVGzAnBgNVHREEIDAeghxkZXYuaXNzdWVyLWJhY2tlbmQuZXVkaXcuZGV2MBIGA1UdJQQLMAkGByiBjF0FAQYwQwYDVR0fBDwwOjA4oDagNIYyaHR0cHM6Ly9wcmVwcm9kLnBraS5ldWRpdy5kZXYvY3JsL3BpZF9DQV9VVF8wMS5jcmwwHQYDVR0OBBYEFPHhwPzF75MgheENYqLlz9LKYjFIMA4GA1UdDwEB_wQEAwIHgDBdBgNVHRIEVjBUhlJodHRwczovL2dpdGh1Yi5jb20vZXUtZGlnaXRhbC1pZGVudGl0eS13YWxsZXQvYXJjaGl0ZWN0dXJlLWFuZC1yZWZlcmVuY2UtZnJhbWV3b3JrMAoGCCqGSM49BAMCA2kAMGYCMQCYykgNwO5GDgWMCQjjnK3GkQg3lU33L2GAkfAI8p1ItuSP7ZLAwhQOfpmgi35pFCkCMQDlYxrIJbkMEzedKPe1popR25VuDfPqgK5rAQvI0yLrZyn3OMmd7uUNbmWCJW7Skq5ZBM_YGFkEyqZndmVyc2lvbmMxLjBvZGlnZXN0QWxnb3JpdGhtZ1NIQS0yNTZsdmFsdWVEaWdlc3RzoXdldS5ldXJvcGEuZWMuZXVkaS5waWQuMbgZAFggOhcWGq5FFshUpShyf_v7d8LYVx6hQCdnxqhpPYHXptEBWCBhxi-7MIUyIEf9eXsmtpb6bS3WMlvb1IKVfJDGL-E3cAJYICXP8ZyU3U_4e51NAohWDbqmeGabjj93_FA6Q7_KxPKwA1ggHEMoLXvCT6RW1CVMeMU47-rwRMj7wVjbJ0_UBQ_sZ-wEWCDT9-SwKjha0nna10diAO9IxPB46svGBKkNiXAR77IdyAVYIMjjf2tii5ocW3XHKUmvtaIje4jpQz0AuL7Twe33abktBlggKhhf9sCpvmndwAAKW4umOxWkLtz4Kyv1h5zcAEwNUvAHWCDp6NsFQJmpb9Jatz_dBayRv14x2Qffl4AxCOzRouFWsQhYIEOC_EaY5ww8qW60NZ_cYfn40xgFSZKjxzReZuqxWMx8CVggHuln1oLn-ZOufRheOmtSHxAxl4acTxZ52w2_QbUYiFgKWCB9i5tS8oKFUb55BroSRVPs1siu1VH5XVV-kt1vUGlhAAtYIB0ta7Hoc4HGgDVL-cLCo7wJ-fOzaXTsfaLc5V56a0GsDFggHSDNQdsvGKwx4pvXJ9zVcwlbUds_6uSwNKiRqBa-QgENWCCA18f0ek8765otJdOkDu-NhvxuKVaRG9YZKPpjARSyWA5YIOzd-VzaPIJPnJTEgkl13Wx8vaZ0JN2roUyyXxQJ19dBD1ggo7HAuf1bjEPAvB_QsPoNGk82qUxifiYfc-clTFQGjs4QWCCV9sgpz0Pwiu9tGxApqWyDc1LtD_Fu5AZ4Gk4Al0TQDhFYIBirH7jbqqpXrh4r0kzLEeut0u8wkIpanFk0TzliVmwnElggTpMBOhEWHDOMUXV2DTBDYtUIcO5j94bZAxZIFfWNsGMTWCCtRqkcGgnf-L4qexXf_bS2I32qfG_tCTUaSSjLBkQibxRYIPrvcdGkjj7uH31FoWjM4aoo7mCwH6TD2FklUg-GfRbtFVgglAIC8TTTc6JW5azcNzrm3DTujvKvb1fT2bOfMnC0ZasWWCAn1cdYJ8UFyYHiG5ZhdJkntNNrtS5ZVSdLfqKZo866QBdYIP3SPKdiReOR5XVI3mP-JIekpQQTFHVCJmhMr8JAuFhcGBhYIIz9kkhORpqu7260xaPkzHBm-T92zcYOcWA0yjGhYU3JbWRldmljZUtleUluZm-haWRldmljZUtleaQBAiABIVggJ0AUWqVTHQCZLfZ9l6etiocOFUDMiwOA9NdRMlnEdNUiWCDQqWiJYDFx5WrF3iWOF_eyDwMlb2lwwbr8vJH9QsEtpmdkb2NUeXBld2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xbHZhbGlkaXR5SW5mb6Nmc2lnbmVkwHgeMjAyNS0wMi0wN1QxNDoxNDoxNC4yNTQxMzU5MzRaaXZhbGlkRnJvbcB4HjIwMjUtMDItMDdUMTQ6MTQ6MTQuMjU0MTM1OTM0Wmp2YWxpZFVudGlswHgeMjAyNy0wMi0wN1QxNDoxNDoxNC4yNTQxMzU5MzRaWEDTbHm2IyQEZlx3sywuYiw3qICbikVdUtyaHceDdV4qIAQdpOScsTAWTH9GVvh1FiPWE2qdQCTdl8O9_wGQpth3bGRldmljZVNpZ25lZKJqbmFtZVNwYWNlc9gYQaBqZGV2aWNlQXV0aKFvZGV2aWNlU2lnbmF0dXJlhEOhASag9lhA0Cu_ymkje1B5BkBExIvyYCaFQqItzzaB8Mr1UPkSj86gWYjvKRhwmPKDEP0BoxZbwDqdmP0z1Q5BFGfIHLFqaqNnZG9jVHlwZXVvcmcuaXNvLjE4MDEzLjUuMS5tRExsaXNzdWVyU2lnbmVkompuYW1lU3BhY2VzoXFvcmcuaXNvLjE4MDEzLjUuMYHYGFhXpGhkaWdlc3RJRABmcmFuZG9tUG79RwEsn9sSFymhhWnyeqZxZWxlbWVudElkZW50aWZpZXJrZmFtaWx5X25hbWVsZWxlbWVudFZhbHVlaEdlb3JnaW91amlzc3VlckF1dGiEQ6EBJqEYIVkDMTCCAy0wggKyoAMCAQICFC_LOU7Ot-ZOjoa0RTJbEkQEmKOmMAoGCCqGSM49BAMCMFwxHjAcBgNVBAMMFVBJRCBJc3N1ZXIgQ0EgLSBVVCAwMTEtMCsGA1UECgwkRVVESSBXYWxsZXQgUmVmZXJlbmNlIEltcGxlbWVudGF0aW9uMQswCQYDVQQGEwJVVDAeFw0yNDExMjkxMTI4MzVaFw0yNjExMjkxMTI4MzRaMGkxHTAbBgNVBAMMFEVVREkgUmVtb3RlIFZlcmlmaWVyMQwwCgYDVQQFEwMwMDExLTArBgNVBAoMJEVVREkgV2FsbGV0IFJlZmVyZW5jZSBJbXBsZW1lbnRhdGlvbjELMAkGA1UEBhMCVVQwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQFmvVGq-6D9WWxhW7BQOIN9T8zRmXMIdr0ezwpJNGIgC-HIa7JYPXI9ZAcp8mYu52a2IDzie8dGrURXZMX147Qo4IBQzCCAT8wDAYDVR0TAQH_BAIwADAfBgNVHSMEGDAWgBSzbLiRFxzXpBpmMYdC4YvAQMyVGzAnBgNVHREEIDAeghxkZXYuaXNzdWVyLWJhY2tlbmQuZXVkaXcuZGV2MBIGA1UdJQQLMAkGByiBjF0FAQYwQwYDVR0fBDwwOjA4oDagNIYyaHR0cHM6Ly9wcmVwcm9kLnBraS5ldWRpdy5kZXYvY3JsL3BpZF9DQV9VVF8wMS5jcmwwHQYDVR0OBBYEFPHhwPzF75MgheENYqLlz9LKYjFIMA4GA1UdDwEB_wQEAwIHgDBdBgNVHRIEVjBUhlJodHRwczovL2dpdGh1Yi5jb20vZXUtZGlnaXRhbC1pZGVudGl0eS13YWxsZXQvYXJjaGl0ZWN0dXJlLWFuZC1yZWZlcmVuY2UtZnJhbWV3b3JrMAoGCCqGSM49BAMCA2kAMGYCMQCYykgNwO5GDgWMCQjjnK3GkQg3lU33L2GAkfAI8p1ItuSP7ZLAwhQOfpmgi35pFCkCMQDlYxrIJbkMEzedKPe1popR25VuDfPqgK5rAQvI0yLrZyn3OMmd7uUNbmWCJW7Skq5ZBOvYGFkE5qZndmVyc2lvbmMxLjBvZGlnZXN0QWxnb3JpdGhtZ1NIQS0yNTZsdmFsdWVEaWdlc3RzoXFvcmcuaXNvLjE4MDEzLjUuMbgaAFggMB0uLEYoIneUL0kereEYCwIDPhFlzG8CRz8mhaOAjqYBWCDeL02NKHTFMnNnvQhiCvqpTol-KZsWotcrp0qQZX5d5QJYIEe49kmpXoF28fhJp_mmyvaJ9_DWptgciOwNDLjvGG3vA1ggwS9c7Pgo_bVTGX6_kKL6b_S_XdFpJeZrNPIzztOfIiYEWCAewkcL6ERlKhMrKfRcIc6kk4686GEw9391vK-1DqC3OAVYICjzEaK6wNF3xg2ihweQATbQe3NWUevjQJA6UE7qgKxBBlgg3HBSVgWY5xeur7rNraq3xyiL9nUWMGU5aOJsSc8tspcHWCAb4P2vyc0Y5AaqLTtupspXYNYOadmK6xPBSlf9CTB6DQhYIIi6l_O69bNVfXPwXmyTIDNGgWUCgasiNr3Py4vtd8lgCVggm_9UfaiuFMpyG5Wk25RMt_NRsRyo_hX1NR1PqzTMeeEKWCCGP-XEprUyt6azpavKitGk-A1uv3_SrJuXqm4MAlZHvAtYIHdyYg5YZxq_Zu5g7ERaw3LytEpihtNT_oXk2eKXsNXBDFgg_5GNWEZH0tJQ_Yd12HuMQCKg0cx2KthoMznsTj3wxeUNWCBU8driwLnS1IB97lWGJ2J79P-tg8FjIZ5CvFIBJ6FACg5YIIIJZd7HfHi06lFp0IbKCcrsVz86mIt39RxTR-603zCgD1ggE20AVA9nIp5-ttQ9i6CU8UD3U3GrH-L-FNoYSlZ_j_0QWCAy6d3Q8GMFj_I_m2KLaw-X-S4eMRBmE7O2Ou_J_H09mxFYIGxt_8sVd3BoMRZiu-uBJovSmstMIgFXSM2FaMmXSydnElggxQJZbssCwVYRnv2ZdAa1eNkFdvgalLNfMEhxpTnNiIsTWCB_u8P7WHe8ll2-OxbM2UXLxNNDPJUQaXo4438QLdSunBRYIMcUaKm2dLv44pOSZvwwTw7y1c3pRiLhS0Or4EQp1ozIFVgg2qZd8xExSL5Ypu6JigV2F3IzdAGCqNq109RVDAHpwsUWWCAfpZrVbcpvXhUwrXewy0LMWpWW8ZmbUiGkM8UARkKEMBdYIIRZ3sDbFWF131NYO2ATE3BrFJLY_2cTzk_UrJ9Vm84RGBhYIG29wGNAT-5IBorJLIin3-bgAYOXW6G_fSa2zFh0J1zFGBlYIAummtqcnzwR_AjgluEA9xb8ClHXm7nDFArD_uyNnpkHbWRldmljZUtleUluZm-haWRldmljZUtleaQBAiABIVgglui92FfsuUU1Q0Sq1ZYIrAOxLzzPS4674eae1vRHoRwiWCAJJtjfLV3LGzfmoBLuCw_y3Nv1fmCd_YRby0hzYn8Tnmdkb2NUeXBldW9yZy5pc28uMTgwMTMuNS4xLm1ETGx2YWxpZGl0eUluZm-jZnNpZ25lZMB4HjIwMjUtMDItMDdUMTQ6MTQ6MTQuNTgxNjk3NDM2Wml2YWxpZEZyb23AeB4yMDI1LTAyLTA3VDE0OjE0OjE0LjU4MTY5NzQzNlpqdmFsaWRVbnRpbMB4HjIwMjctMDItMDdUMTQ6MTQ6MTQuNTgxNjk3NDM2WlhAGmdQqmiiBzUJkYj_dUzBwGjjwWMdO_qC_MmEvP-ni6il-VTBkJe2952j87Oa9v-a-HbfTcAKgX7w0BFb46iAs2xkZXZpY2VTaWduZWSiam5hbWVTcGFjZXPYGEGgamRldmljZUF1dGihb2RldmljZVNpZ25hdHVyZYRDoQEmoPZYQOsoPictwMbFLFsbHRyS7GnPn9nHYogN-xkLYjJv0DGs0YU7LhAHRpqLGFe1ira5MD7ryABhUSUeoNth94vr3W1mc3RhdHVzAA',
            ],
            presentation_submission: {
              id: '8b127681-f88b-4559-a94c-3d4a2ac6c189',
              definition_id: '85d62545-4b4c-45e1-843e-b816b4094695',
              descriptor_map: [
                {
                  id: 'eu.europa.ec.eudi.pid.1',
                  format: 'mso_mdoc',
                  path: '$',
                },
              ],
            },
          },
        };

        decodersRegistryServiceSpy.decoderOf.and.returnValue({
          decode: jasmine
            .createSpy('decode')
            .and.returnValue(of('decodedValueForMsoMdoc')),
          supports: (format: AttestationFormat) =>
            format === AttestationFormat.MSO_MDOC,
        });

        service
          .mapVpTokenToAttestations(mockConcludedTransaction)
          .subscribe((result) => {
            expect(result.length).toBe(1);
            expect(decodersRegistryServiceSpy.decoderOf).toHaveBeenCalled();
            done();
          });
      });

      it('should map VP token to sdjwt attestations', (done) => {
        const mockConcludedTransaction: ConcludedTransaction = {
          transactionId: 'mockTransactionId',
          nonce: 'mockNonce',
          presentationQuery: {
            id: '6a2c2d13-294d-4b34-a014-95cbb2175719',
            input_descriptors: [
              {
                id: 'eea9e21a-e33a-4a65-9bfe-62d402419d25',
                name: 'Person Identification Data (PID)',
                purpose: '',
                format: {
                  'dc+sd-jwt': {
                    'sd-jwt_alg_values': ['ES256', 'ES384', 'ES512'],
                    'kb-jwt_alg_values': [
                      'RS256',
                      'RS384',
                      'RS512',
                      'ES256',
                      'ES384',
                      'ES512',
                    ],
                  },
                },
                constraints: {
                  fields: [
                    {
                      path: ['$.vct'],
                      filter: {
                        type: 'string',
                        const: 'urn:eudi:pid:1',
                      },
                    },
                    {
                      path: ['$.family_name'],
                      intent_to_retain: false,
                    },
                    {
                      path: ['$.given_name'],
                      intent_to_retain: false,
                    },
                  ],
                },
              },
            ],
          },
          walletResponse: {
            vp_token: [
              'eyJhbGciOiAiRVMyNTYiLCAidHlwIjogInZjK3NkLWp3dCIsICJ4NWMiOiBbIk1JSUMzekNDQW9XZ0F3SUJBZ0lVZjNsb2hUbURNQW1TL1lYL3E0aHFvUnlKQjU0d0NnWUlLb1pJemowRUF3SXdYREVlTUJ3R0ExVUVBd3dWVUVsRUlFbHpjM1ZsY2lCRFFTQXRJRlZVSURBeU1TMHdLd1lEVlFRS0RDUkZWVVJKSUZkaGJHeGxkQ0JTWldabGNtVnVZMlVnU1cxd2JHVnRaVzUwWVhScGIyNHhDekFKQmdOVkJBWVRBbFZVTUI0WERUSTFNRFF4TURFME16YzFNbG9YRFRJMk1EY3dOREUwTXpjMU1Wb3dVakVVTUJJR0ExVUVBd3dMVUVsRUlFUlRJQzBnTURFeExUQXJCZ05WQkFvTUpFVlZSRWtnVjJGc2JHVjBJRkpsWm1WeVpXNWpaU0JKYlhCc1pXMWxiblJoZEdsdmJqRUxNQWtHQTFVRUJoTUNWVlF3V1RBVEJnY3Foa2pPUFFJQkJnZ3Foa2pPUFFNQkJ3TkNBQVM3V0FBV3FQemUwVXMzejhwYWp5VlBXQlJtclJiQ2k1WDJzOUd2bHliUXl0d1R1bWNabmVqOUJrTGZBZ2xsb1g1dHYrTmdXZkRmZ3QvMDZzKzV0VjRsbzRJQkxUQ0NBU2t3SHdZRFZSMGpCQmd3Rm9BVVlzZVVSeWk5RDZJV0lLZWF3a21VUlBFQjA4Y3dHd1lEVlIwUkJCUXdFb0lRYVhOemRXVnlMbVYxWkdsM0xtUmxkakFXQmdOVkhTVUJBZjhFRERBS0JnZ3JnUUlDQUFBQkFqQkRCZ05WSFI4RVBEQTZNRGlnTnFBMGhqSm9kSFJ3Y3pvdkwzQnlaWEJ5YjJRdWNHdHBMbVYxWkdsM0xtUmxkaTlqY213dmNHbGtYME5CWDFWVVh6QXlMbU55YkRBZEJnTlZIUTRFRmdRVXFsL29weGtRbFl5MGxsYVRvUGJERS9teUVjRXdEZ1lEVlIwUEFRSC9CQVFEQWdlQU1GMEdBMVVkRWdSV01GU0dVbWgwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzlsZFMxa2FXZHBkR0ZzTFdsa1pXNTBhWFI1TFhkaGJHeGxkQzloY21Ob2FYUmxZM1IxY21VdFlXNWtMWEpsWm1WeVpXNWpaUzFtY21GdFpYZHZjbXN3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUloQU5KVlNEc3FUM0lrR2NLV1dnU2V1YmtET2RpNS9VRTliMUdGL1g1ZlFSRmFBaUJwNXQ2dEhoOFh3RmhQc3R6T0hNb3B2QkQvR3dtczBSQVVnbVNuNmt1OEdnPT0iXX0.eyJfc2QiOiBbIjU1UFdUZ0c5NXRSTlRUejJJREhSQUxING50VXctOWhPZElGcktrbGZvaEkiLCAiN0poVW5KS2N4bU9Qd01pc05iMkd1cWpMdy1SQnUyanBtaHM3REtFczJrZyIsICJEZGVzOGpxanVZMXlRWXhMbEtUX3VGaTlFQV9TWEJWdWs1LV9CMVBRWXVRIiwgImJQekFPVDBlQTZVWVUzT2lUQnVOcjN0d0RCMjlvVG83RWpEMW5FYTBndUEiLCAibWx2ZmVNXzVSV0JZaWZaNjI1RjlYMHBXTGRjRkctYVpsSmYxTTdSZkg4TSIsICJxSWNORXNHQVhRNTJJXzU5aUJXLVJQYUQ4OF9fZzJ0YzF3cVZEX29XbWhNIiwgInRKT3ZhWk1xSlcxS0l2cm45NXJOeGpjMFE4ZVE2enYzMEZlWXZJUnhYNXMiXSwgImlzcyI6ICJodHRwczovL2lzc3Vlci5ldWRpdy5kZXYiLCAiaWF0IjogMTc0NDMyNjAwMCwgImV4cCI6IDE3NTIxMDIwMDAsICJ2Y3QiOiAidXJuOmV1LmV1cm9wYS5lYy5ldWRpOnBpZDoxIiwgInN0YXR1cyI6IHsiaWRlbnRpZmllcl9saXN0IjogeyJpZCI6ICIyMTE0IiwgInVyaSI6ICJodHRwczovL2lzc3Vlci5ldWRpdy5kZXYvaWRlbnRpZmllcl9saXN0L0ZDL2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xLzM0NTk1MThjLTA4MmUtNGUyMS1iMjMxLTIwOWZlZTJkNDllZCJ9LCAic3RhdHVzX2xpc3QiOiB7ImlkeCI6IDIxMTQsICJ1cmkiOiAiaHR0cHM6Ly9pc3N1ZXIuZXVkaXcuZGV2L3Rva2VuX3N0YXR1c19saXN0L0ZDL2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xLzM0NTk1MThjLTA4MmUtNGUyMS1iMjMxLTIwOWZlZTJkNDllZCJ9fSwgIl9zZF9hbGciOiAic2hhLTI1NiIsICJjbmYiOiB7Imp3ayI6IHsia3R5IjogIkVDIiwgImNydiI6ICJQLTI1NiIsICJ4IjogImpMaXQtU0FHb2V3c2ZVTDFIaTJsaDhvYWxpSXRhVG5yUHZab25KTUlQWWciLCAieSI6ICIwQUljZUs0Ui1tV0tBRzdmUXBzbTZLUFFxVGJxMlkybWxaTVFiR29CUWpJIn19fQ.m43u0CH-p55Rq7F_Cr7OW_KEHoEOfLw8G-GwUQ1iS8_TPFffYUaAo8-gAO5w43HLxD5pOtowZYgsKj-PdxN4wQ~WyI5TEpOY1E3OWpUTEJDazBsSzBiOWV3IiwgImZhbWlseV9uYW1lIiwgIkFhYSJd~WyJfcWl3dGprMDFWMVJGZWxhTFEwSTJ3IiwgImdpdmVuX25hbWUiLCAiQmJiIl0~eyJ0eXAiOiJrYitqd3QiLCJhbGciOiJFUzI1NiJ9.eyJzZF9oYXNoIjoiYll4RGdNaFBfM1F4M19NaXdCa3prLWxnUnRQS0tCYmxhcWIxT0twbDg0YyIsImF1ZCI6Ing1MDlfc2FuX2RuczpkZXYudmVyaWZpZXItYmFja2VuZC5ldWRpdy5kZXYiLCJub25jZSI6IjBkYzBhNzg5LWM2YTQtNDVmZS1iZTA3LTk3NGU4NDBmMjYyMiIsImlhdCI6MTc0NTgyODYyNH0.ninDXZu4-0pHJSkVwzlwRN-KUe_sVfU7s68NtGkIEsM7lZZn2WLReMDWDX9jX2rTjg1IZsiTKzgcrxHaWzzNVg',
            ],
            presentation_submission: {
              id: '50ee473b-69e7-49da-881e-4fa39708ca06',
              definition_id: '6a2c2d13-294d-4b34-a014-95cbb2175719',
              descriptor_map: [
                {
                  id: 'eea9e21a-e33a-4a65-9bfe-62d402419d25',
                  format: 'dc+sd-jwt',
                  path: '$',
                },
              ],
            },
          },
        };

        decodersRegistryServiceSpy.decoderOf.and.returnValue({
          decode: jasmine
            .createSpy('decode')
            .and.returnValue(of('decodedValueForSdJwt')),
          supports: (format: AttestationFormat) =>
            format === AttestationFormat.SD_JWT_VC,
        });

        service
          .mapVpTokenToAttestations(mockConcludedTransaction)
          .subscribe((result) => {
            expect(result.length).toBe(1);
            expect(decodersRegistryServiceSpy.decoderOf).toHaveBeenCalled();
            done();
          });
      });
    });

    describe('dcql', () => {
      it('should map VP token to attestations for mso mdoc dcql', (done) => {
        const mockConcludedTransaction: ConcludedTransaction = {
          transactionId: 'mockTransactionId',
          nonce: 'mockNonce',
          presentationQuery: {
            credentials: [
              {
                id: 'query_0',
                format: 'mso_mdoc',
                meta: {
                  doctype_value: 'eu.europa.ec.eudi.pid.1',
                },
                claims: [
                  {
                    path: ['eu.europa.ec.eudi.pid.1', 'family_name'],
                    intent_to_retain: false,
                  },
                  {
                    path: ['eu.europa.ec.eudi.pid.1', 'given_name'],
                    intent_to_retain: false,
                  },
                ],
              },
            ],
          },
          walletResponse: {
            vp_token: {
              query_0:
                'o2d2ZXJzaW9uYzEuMGlkb2N1bWVudHOCo2dkb2NUeXBld2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xbGlzc3VlclNpZ25lZKJqbmFtZVNwYWNlc6F3ZXUuZXVyb3BhLmVjLmV1ZGkucGlkLjGB2BhYU6RoZGlnZXN0SUQBZnJhbmRvbVDLOKt7d-Qv5sfsfZLl6ZY_cWVsZW1lbnRJZGVudGlmaWVya2ZhbWlseV9uYW1lbGVsZW1lbnRWYWx1ZWROZWFsamlzc3VlckF1dGiEQ6EBJqEYIVkDMTCCAy0wggKyoAMCAQICFC_LOU7Ot-ZOjoa0RTJbEkQEmKOmMAoGCCqGSM49BAMCMFwxHjAcBgNVBAMMFVBJRCBJc3N1ZXIgQ0EgLSBVVCAwMTEtMCsGA1UECgwkRVVESSBXYWxsZXQgUmVmZXJlbmNlIEltcGxlbWVudGF0aW9uMQswCQYDVQQGEwJVVDAeFw0yNDExMjkxMTI4MzVaFw0yNjExMjkxMTI4MzRaMGkxHTAbBgNVBAMMFEVVREkgUmVtb3RlIFZlcmlmaWVyMQwwCgYDVQQFEwMwMDExLTArBgNVBAoMJEVVREkgV2FsbGV0IFJlZmVyZW5jZSBJbXBsZW1lbnRhdGlvbjELMAkGA1UEBhMCVVQwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQFmvVGq-6D9WWxhW7BQOIN9T8zRmXMIdr0ezwpJNGIgC-HIa7JYPXI9ZAcp8mYu52a2IDzie8dGrURXZMX147Qo4IBQzCCAT8wDAYDVR0TAQH_BAIwADAfBgNVHSMEGDAWgBSzbLiRFxzXpBpmMYdC4YvAQMyVGzAnBgNVHREEIDAeghxkZXYuaXNzdWVyLWJhY2tlbmQuZXVkaXcuZGV2MBIGA1UdJQQLMAkGByiBjF0FAQYwQwYDVR0fBDwwOjA4oDagNIYyaHR0cHM6Ly9wcmVwcm9kLnBraS5ldWRpdy5kZXYvY3JsL3BpZF9DQV9VVF8wMS5jcmwwHQYDVR0OBBYEFPHhwPzF75MgheENYqLlz9LKYjFIMA4GA1UdDwEB_wQEAwIHgDBdBgNVHRIEVjBUhlJodHRwczovL2dpdGh1Yi5jb20vZXUtZGlnaXRhbC1pZGVudGl0eS13YWxsZXQvYXJjaGl0ZWN0dXJlLWFuZC1yZWZlcmVuY2UtZnJhbWV3b3JrMAoGCCqGSM49BAMCA2kAMGYCMQCYykgNwO5GDgWMCQjjnK3GkQg3lU33L2GAkfAI8p1ItuSP7ZLAwhQOfpmgi35pFCkCMQDlYxrIJbkMEzedKPe1popR25VuDfPqgK5rAQvI0yLrZyn3OMmd7uUNbmWCJW7Skq5ZBM_YGFkEyqZndmVyc2lvbmMxLjBvZGlnZXN0QWxnb3JpdGhtZ1NIQS0yNTZsdmFsdWVEaWdlc3RzoXdldS5ldXJvcGEuZWMuZXVkaS5waWQuMbgZAFggOhcWGq5FFshUpShyf_v7d8LYVx6hQCdnxqhpPYHXptEBWCBhxi-7MIUyIEf9eXsmtpb6bS3WMlvb1IKVfJDGL-E3cAJYICXP8ZyU3U_4e51NAohWDbqmeGabjj93_FA6Q7_KxPKwA1ggHEMoLXvCT6RW1CVMeMU47-rwRMj7wVjbJ0_UBQ_sZ-wEWCDT9-SwKjha0nna10diAO9IxPB46svGBKkNiXAR77IdyAVYIMjjf2tii5ocW3XHKUmvtaIje4jpQz0AuL7Twe33abktBlggKhhf9sCpvmndwAAKW4umOxWkLtz4Kyv1h5zcAEwNUvAHWCDp6NsFQJmpb9Jatz_dBayRv14x2Qffl4AxCOzRouFWsQhYIEOC_EaY5ww8qW60NZ_cYfn40xgFSZKjxzReZuqxWMx8CVggHuln1oLn-ZOufRheOmtSHxAxl4acTxZ52w2_QbUYiFgKWCB9i5tS8oKFUb55BroSRVPs1siu1VH5XVV-kt1vUGlhAAtYIB0ta7Hoc4HGgDVL-cLCo7wJ-fOzaXTsfaLc5V56a0GsDFggHSDNQdsvGKwx4pvXJ9zVcwlbUds_6uSwNKiRqBa-QgENWCCA18f0ek8765otJdOkDu-NhvxuKVaRG9YZKPpjARSyWA5YIOzd-VzaPIJPnJTEgkl13Wx8vaZ0JN2roUyyXxQJ19dBD1ggo7HAuf1bjEPAvB_QsPoNGk82qUxifiYfc-clTFQGjs4QWCCV9sgpz0Pwiu9tGxApqWyDc1LtD_Fu5AZ4Gk4Al0TQDhFYIBirH7jbqqpXrh4r0kzLEeut0u8wkIpanFk0TzliVmwnElggTpMBOhEWHDOMUXV2DTBDYtUIcO5j94bZAxZIFfWNsGMTWCCtRqkcGgnf-L4qexXf_bS2I32qfG_tCTUaSSjLBkQibxRYIPrvcdGkjj7uH31FoWjM4aoo7mCwH6TD2FklUg-GfRbtFVgglAIC8TTTc6JW5azcNzrm3DTujvKvb1fT2bOfMnC0ZasWWCAn1cdYJ8UFyYHiG5ZhdJkntNNrtS5ZVSdLfqKZo866QBdYIP3SPKdiReOR5XVI3mP-JIekpQQTFHVCJmhMr8JAuFhcGBhYIIz9kkhORpqu7260xaPkzHBm-T92zcYOcWA0yjGhYU3JbWRldmljZUtleUluZm-haWRldmljZUtleaQBAiABIVggJ0AUWqVTHQCZLfZ9l6etiocOFUDMiwOA9NdRMlnEdNUiWCDQqWiJYDFx5WrF3iWOF_eyDwMlb2lwwbr8vJH9QsEtpmdkb2NUeXBld2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xbHZhbGlkaXR5SW5mb6Nmc2lnbmVkwHgeMjAyNS0wMi0wN1QxNDoxNDoxNC4yNTQxMzU5MzRaaXZhbGlkRnJvbcB4HjIwMjUtMDItMDdUMTQ6MTQ6MTQuMjU0MTM1OTM0Wmp2YWxpZFVudGlswHgeMjAyNy0wMi0wN1QxNDoxNDoxNC4yNTQxMzU5MzRaWEDTbHm2IyQEZlx3sywuYiw3qICbikVdUtyaHceDdV4qIAQdpOScsTAWTH9GVvh1FiPWE2qdQCTdl8O9_wGQpth3bGRldmljZVNpZ25lZKJqbmFtZVNwYWNlc9gYQaBqZGV2aWNlQXV0aKFvZGV2aWNlU2lnbmF0dXJlhEOhASag9lhA0Cu_ymkje1B5BkBExIvyYCaFQqItzzaB8Mr1UPkSj86gWYjvKRhwmPKDEP0BoxZbwDqdmP0z1Q5BFGfIHLFqaqNnZG9jVHlwZXVvcmcuaXNvLjE4MDEzLjUuMS5tRExsaXNzdWVyU2lnbmVkompuYW1lU3BhY2VzoXFvcmcuaXNvLjE4MDEzLjUuMYHYGFhXpGhkaWdlc3RJRABmcmFuZG9tUG79RwEsn9sSFymhhWnyeqZxZWxlbWVudElkZW50aWZpZXJrZmFtaWx5X25hbWVsZWxlbWVudFZhbHVlaEdlb3JnaW91amlzc3VlckF1dGiEQ6EBJqEYIVkDMTCCAy0wggKyoAMCAQICFC_LOU7Ot-ZOjoa0RTJbEkQEmKOmMAoGCCqGSM49BAMCMFwxHjAcBgNVBAMMFVBJRCBJc3N1ZXIgQ0EgLSBVVCAwMTEtMCsGA1UECgwkRVVESSBXYWxsZXQgUmVmZXJlbmNlIEltcGxlbWVudGF0aW9uMQswCQYDVQQGEwJVVDAeFw0yNDExMjkxMTI4MzVaFw0yNjExMjkxMTI4MzRaMGkxHTAbBgNVBAMMFEVVREkgUmVtb3RlIFZlcmlmaWVyMQwwCgYDVQQFEwMwMDExLTArBgNVBAoMJEVVREkgV2FsbGV0IFJlZmVyZW5jZSBJbXBsZW1lbnRhdGlvbjELMAkGA1UEBhMCVVQwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQFmvVGq-6D9WWxhW7BQOIN9T8zRmXMIdr0ezwpJNGIgC-HIa7JYPXI9ZAcp8mYu52a2IDzie8dGrURXZMX147Qo4IBQzCCAT8wDAYDVR0TAQH_BAIwADAfBgNVHSMEGDAWgBSzbLiRFxzXpBpmMYdC4YvAQMyVGzAnBgNVHREEIDAeghxkZXYuaXNzdWVyLWJhY2tlbmQuZXVkaXcuZGV2MBIGA1UdJQQLMAkGByiBjF0FAQYwQwYDVR0fBDwwOjA4oDagNIYyaHR0cHM6Ly9wcmVwcm9kLnBraS5ldWRpdy5kZXYvY3JsL3BpZF9DQV9VVF8wMS5jcmwwHQYDVR0OBBYEFPHhwPzF75MgheENYqLlz9LKYjFIMA4GA1UdDwEB_wQEAwIHgDBdBgNVHRIEVjBUhlJodHRwczovL2dpdGh1Yi5jb20vZXUtZGlnaXRhbC1pZGVudGl0eS13YWxsZXQvYXJjaGl0ZWN0dXJlLWFuZC1yZWZlcmVuY2UtZnJhbWV3b3JrMAoGCCqGSM49BAMCA2kAMGYCMQCYykgNwO5GDgWMCQjjnK3GkQg3lU33L2GAkfAI8p1ItuSP7ZLAwhQOfpmgi35pFCkCMQDlYxrIJbkMEzedKPe1popR25VuDfPqgK5rAQvI0yLrZyn3OMmd7uUNbmWCJW7Skq5ZBOvYGFkE5qZndmVyc2lvbmMxLjBvZGlnZXN0QWxnb3JpdGhtZ1NIQS0yNTZsdmFsdWVEaWdlc3RzoXFvcmcuaXNvLjE4MDEzLjUuMbgaAFggMB0uLEYoIneUL0kereEYCwIDPhFlzG8CRz8mhaOAjqYBWCDeL02NKHTFMnNnvQhiCvqpTol-KZsWotcrp0qQZX5d5QJYIEe49kmpXoF28fhJp_mmyvaJ9_DWptgciOwNDLjvGG3vA1ggwS9c7Pgo_bVTGX6_kKL6b_S_XdFpJeZrNPIzztOfIiYEWCAewkcL6ERlKhMrKfRcIc6kk4686GEw9391vK-1DqC3OAVYICjzEaK6wNF3xg2ihweQATbQe3NWUevjQJA6UE7qgKxBBlgg3HBSVgWY5xeur7rNraq3xyiL9nUWMGU5aOJsSc8tspcHWCAb4P2vyc0Y5AaqLTtupspXYNYOadmK6xPBSlf9CTB6DQhYIIi6l_O69bNVfXPwXmyTIDNGgWUCgasiNr3Py4vtd8lgCVggm_9UfaiuFMpyG5Wk25RMt_NRsRyo_hX1NR1PqzTMeeEKWCCGP-XEprUyt6azpavKitGk-A1uv3_SrJuXqm4MAlZHvAtYIHdyYg5YZxq_Zu5g7ERaw3LytEpihtNT_oXk2eKXsNXBDFgg_5GNWEZH0tJQ_Yd12HuMQCKg0cx2KthoMznsTj3wxeUNWCBU8driwLnS1IB97lWGJ2J79P-tg8FjIZ5CvFIBJ6FACg5YIIIJZd7HfHi06lFp0IbKCcrsVz86mIt39RxTR-603zCgD1ggE20AVA9nIp5-ttQ9i6CU8UD3U3GrH-L-FNoYSlZ_j_0QWCAy6d3Q8GMFj_I_m2KLaw-X-S4eMRBmE7O2Ou_J_H09mxFYIGxt_8sVd3BoMRZiu-uBJovSmstMIgFXSM2FaMmXSydnElggxQJZbssCwVYRnv2ZdAa1eNkFdvgalLNfMEhxpTnNiIsTWCB_u8P7WHe8ll2-OxbM2UXLxNNDPJUQaXo4438QLdSunBRYIMcUaKm2dLv44pOSZvwwTw7y1c3pRiLhS0Or4EQp1ozIFVgg2qZd8xExSL5Ypu6JigV2F3IzdAGCqNq109RVDAHpwsUWWCAfpZrVbcpvXhUwrXewy0LMWpWW8ZmbUiGkM8UARkKEMBdYIIRZ3sDbFWF131NYO2ATE3BrFJLY_2cTzk_UrJ9Vm84RGBhYIG29wGNAT-5IBorJLIin3-bgAYOXW6G_fSa2zFh0J1zFGBlYIAummtqcnzwR_AjgluEA9xb8ClHXm7nDFArD_uyNnpkHbWRldmljZUtleUluZm-haWRldmljZUtleaQBAiABIVgglui92FfsuUU1Q0Sq1ZYIrAOxLzzPS4674eae1vRHoRwiWCAJJtjfLV3LGzfmoBLuCw_y3Nv1fmCd_YRby0hzYn8Tnmdkb2NUeXBldW9yZy5pc28uMTgwMTMuNS4xLm1ETGx2YWxpZGl0eUluZm-jZnNpZ25lZMB4HjIwMjUtMDItMDdUMTQ6MTQ6MTQuNTgxNjk3NDM2Wml2YWxpZEZyb23AeB4yMDI1LTAyLTA3VDE0OjE0OjE0LjU4MTY5NzQzNlpqdmFsaWRVbnRpbMB4HjIwMjctMDItMDdUMTQ6MTQ6MTQuNTgxNjk3NDM2WlhAGmdQqmiiBzUJkYj_dUzBwGjjwWMdO_qC_MmEvP-ni6il-VTBkJe2952j87Oa9v-a-HbfTcAKgX7w0BFb46iAs2xkZXZpY2VTaWduZWSiam5hbWVTcGFjZXPYGEGgamRldmljZUF1dGihb2RldmljZVNpZ25hdHVyZYRDoQEmoPZYQOsoPictwMbFLFsbHRyS7GnPn9nHYogN-xkLYjJv0DGs0YU7LhAHRpqLGFe1ira5MD7ryABhUSUeoNth94vr3W1mc3RhdHVzAA',
            },
          },
        };

        decodersRegistryServiceSpy.decoderOf.and.returnValue({
          decode: jasmine
            .createSpy('decode')
            .and.returnValue(of('decodedValueForDcql')),
          supports: (format: AttestationFormat) =>
            format === AttestationFormat.MSO_MDOC,
        });

        service
          .mapVpTokenToAttestations(mockConcludedTransaction)
          .subscribe((result) => {
            expect(result.length).toBe(1);
            expect(decodersRegistryServiceSpy.decoderOf).toHaveBeenCalled();
            done();
          });
      });
    });
  });
});
