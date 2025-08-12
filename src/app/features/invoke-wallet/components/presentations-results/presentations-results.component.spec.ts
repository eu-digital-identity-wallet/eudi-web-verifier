import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationsResultsComponent } from './presentations-results.component';
import { MatListModule } from '@angular/material/list';
import { WalletResponseProcessorService } from '../../services/wallet-response-processor.service';
import { JWTService } from '@app/core/services/jwt.service';
import { VerifierEndpointService } from '@app/core/services/verifier-endpoint.service';
import { provideHttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

describe('PresentationsResultsComponent', () => {
  let component: PresentationsResultsComponent;
  let fixture: ComponentFixture<PresentationsResultsComponent>;

  beforeEach(async () => {
    const toastrService = jasmine.createSpyObj<ToastrService>(
      'ToasterService',
      ['error', 'success']
    );
    await TestBed.configureTestingModule({
      imports: [MatListModule],
      providers: [
        WalletResponseProcessorService,
        JWTService,
        VerifierEndpointService,
        provideHttpClient(),
        { provide: ToastrService, useValue: toastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PresentationsResultsComponent);
    component = fixture.componentInstance;
    component.concludedTransaction = {
      transactionId: 'transactionId',
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
            'o2d2ZXJzaW9uYzEuMGlkb2N1bWVudHOBo2dkb2NUeXBld2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xbGlzc3VlclNpZ25lZKJqbmFtZVNwYWNlc6F3ZXUuZXVyb3BhLmVjLmV1ZGkucGlkLjGC2BhYZ6RmcmFuZG9tWCCOTMd2JLglX7PYopjDNtRUyz-gmcsHyylcaBJ79swKN2hkaWdlc3RJRAdsZWxlbWVudFZhbHVlZ0RpbXRzYXNxZWxlbWVudElkZW50aWZpZXJrZmFtaWx5X25hbWXYGFhnpGZyYW5kb21YIDDuJG224tsw0sp_MOrToWUpZQr29FvvWidC0uNJ__nyaGRpZ2VzdElECGxlbGVtZW50VmFsdWVoR2Vvcmdpb3NxZWxlbWVudElkZW50aWZpZXJqZ2l2ZW5fbmFtZWppc3N1ZXJBdXRohEOhASahGCFZAuYwggLiMIICiaADAgECAhQOuT--SkPBx4bpIc2ygNoXGI0_RzAKBggqhkjOPQQDAjBcMR4wHAYDVQQDDBVQSUQgSXNzdWVyIENBIC0gVVQgMDIxLTArBgNVBAoMJEVVREkgV2FsbGV0IFJlZmVyZW5jZSBJbXBsZW1lbnRhdGlvbjELMAkGA1UEBhMCVVQwHhcNMjUwNDEwMTQ0NDEyWhcNMjYwNzA0MTQ0NDExWjBSMRQwEgYDVQQDDAtQSUQgRFMgLSAwMjEtMCsGA1UECgwkRVVESSBXYWxsZXQgUmVmZXJlbmNlIEltcGxlbWVudGF0aW9uMQswCQYDVQQGEwJVVDBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABO3wrcYBPDl-MjTNo7kYQ4Jpeu5-rQtcahqOQGPRNXlhCrSbCft9m9mtuCyUw-Bjjmx6z3hsRCy7e41vzYn0mzSjggExMIIBLTAfBgNVHSMEGDAWgBRix5RHKL0PohYgp5rCSZRE8QHTxzAfBgNVHREEGDAWghRkZXYuaXNzdWVyLmV1ZGl3LmRldjAWBgNVHSUBAf8EDDAKBggrgQICAAABAjBDBgNVHR8EPDA6MDigNqA0hjJodHRwczovL3ByZXByb2QucGtpLmV1ZGl3LmRldi9jcmwvcGlkX0NBX1VUXzAyLmNybDAdBgNVHQ4EFgQU5nRWfcGLy1a6ryVI1YpZdKQ_fMMwDgYDVR0PAQH_BAQDAgeAMF0GA1UdEgRWMFSGUmh0dHBzOi8vZ2l0aHViLmNvbS9ldS1kaWdpdGFsLWlkZW50aXR5LXdhbGxldC9hcmNoaXRlY3R1cmUtYW5kLXJlZmVyZW5jZS1mcmFtZXdvcmswCgYIKoZIzj0EAwIDRwAwRAIgC0KkICFNvLA9AOIPLhS3eQSaKPETTbk_Mit0t4CEUdgCIGja5Cuf5pLluNAq9X6e6oZC0fl09HTQBNBDlCYNUwUlWQPd2BhZA9inZnN0YXR1c6Jrc3RhdHVzX2xpc3SiY2lkeBkdymN1cml4bmh0dHBzOi8vZGV2Lmlzc3Vlci5ldWRpdy5kZXYvdG9rZW5fc3RhdHVzX2xpc3QvRkMvZXUuZXVyb3BhLmVjLmV1ZGkucGlkLjEvYzhiNDYxMmEtN2VhMy00YTdiLWI0NjktODQxZTQzN2IxMTI4b2lkZW50aWZpZXJfbGlzdKJiaWRkNzYyNmN1cml4bGh0dHBzOi8vZGV2Lmlzc3Vlci5ldWRpdy5kZXYvaWRlbnRpZmllcl9saXN0L0ZDL2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xL2M4YjQ2MTJhLTdlYTMtNGE3Yi1iNDY5LTg0MWU0MzdiMTEyOGdkb2NUeXBld2V1LmV1cm9wYS5lYy5ldWRpLnBpZC4xZ3ZlcnNpb25jMS4wbHZhbGlkaXR5SW5mb6Nmc2lnbmVkwHQyMDI1LTA3LTA5VDEyOjA3OjEzWml2YWxpZEZyb23AdDIwMjUtMDctMDlUMTI6MDc6MTNaanZhbGlkVW50aWzAdDIwMjUtMTAtMDdUMDA6MDA6MDBabHZhbHVlRGlnZXN0c6F3ZXUuZXVyb3BhLmVjLmV1ZGkucGlkLjGrAFggcFUXiGJ5gUuRu5e7HXixWd5CarRXi5zPzAkgud8J_8UBWCBiUh92Bf97aJXeiV93aaH5fLmeM3UdwUlXKqUb1oex9QJYIIqeHIjGgKxSBSGUhKnEbDVyBGLflT3JO6KIL3n_IXQJA1gg_MgeQfPoHQywNp_3ZqOCE0aYpLbLNRrE1x31miD-P9sEWCDTPWJ1_WKmxXGbrKVMgtgVPh5Twa8FNybPUGIH1XOBTwVYINMx5dM-ZBaIOdP0sZNfVmwICMl25f8EcZneY5Xr9vDzBlggAPjQCrVpASbmeLjal6ND2lMyCvYsBsye_tdUz_2YmQ0HWCB0tRQ3GiMyiBG5SAFEBYj1V45DVW4Fgdf5_GmI_Sll6QhYIOHP4wV4zizW_-07NtPBSR4J7UnHhZrFDOZdSSXFfSm9CVgggycwMgEInRE3M4DlBz28Z-ZBesNk6C-4aglCHAUy3rMKWCDU0k6OdKJWjiegRKpKBO0RHR5pAUnCJBPO4jkwQd8glW1kZXZpY2VLZXlJbmZvoWlkZXZpY2VLZXmkAQIgASFYIAbmo5uUc9pTkBixwYUTMpUzt3Z4Aj8yFndSLLTHq65OIlggUgpU1KNuQnNR5NeCD_4gUpKTTnEI-9fxfds1nd0641lvZGlnZXN0QWxnb3JpdGhtZ1NIQS0yNTZYQCdGmkIPUd7HlvJqwqvPx3i9DLOBS_-ccYhEcnzfUNA33c3526QlXd9kfaxzlqDnQ97c_KGJjKWAzJKEmOVFmyBsZGV2aWNlU2lnbmVkompuYW1lU3BhY2Vz2BhBoGpkZXZpY2VBdXRooW9kZXZpY2VTaWduYXR1cmWEQ6EBJqD2WECRmheKJZFOeUPy1mmegKSFWaUfLwQ-iYD5S6tUPpwNQx-J1m9CnWuydkxwrhdEjAzfAGeQdi1VqD5_Ax6_YLevZnN0YXR1cwA',
        }
      },
      nonce: 'nonce',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
