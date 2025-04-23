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
      // declarations: [ PresentationsResultsComponent ]
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
        id: 'id',
        input_descriptors: [],
      },
      walletResponse: {
        presentation_submission: {
          id: 'id',
          definition_id: 'definition_id',
          descriptor_map: [],
        },
        vp_token: ['vp_token'],
        id_token: 'id_token',
      },
      nonce: 'nonce',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
