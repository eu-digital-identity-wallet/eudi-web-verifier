import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { WalletRedirectComponent } from './wallet-redirect.component';
import { WalletResponse } from '@core/models/WalletResponse';
import { provideHttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

describe('WalletRedirectComponent', () => {
  let component: WalletRedirectComponent;
  let fixture: ComponentFixture<WalletRedirectComponent>;

  beforeEach(async () => {
    const toastrService = jasmine.createSpyObj<ToastrService>(
      'ToasterService',
      ['error', 'success']
    );
    const walletResponse: WalletResponse = {
      presentation_submission: {
        id: 'id',
        definition_id: 'definition_id',
        descriptor_map: [],
      },
      id_token: 'id_token',
      vp_token: ['vp_token'],
    };
    await TestBed.configureTestingModule({
      imports: [WalletRedirectComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: walletResponse },
          },
        },
        { provide: ToastrService, useValue: toastrService },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
