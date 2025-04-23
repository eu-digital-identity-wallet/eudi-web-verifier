import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeComponent } from './qr-code.component';
import { SharedModule } from '@shared/shared.module';
import { WalletLayoutComponent } from '@core/layout/wallet-layout/wallet-layout.component';
import { RouterModule } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { DataService } from '@core/services/data.service';
import { NavigateService } from '@core/services/navigate.service';

const qrData = {
  transaction_id:
    'AhF1PtlSCxN7sAMMTQPyAiBjgeVNj6vXC-xXtkH8Ai6gJfdDtUPXewN2Kc1p5EKNnQzR2i6FMKvH7qPH_mxnxA',
  client_id: 'Verifier',
  request_uri:
    'http://localhost:8080/wallet/request.jwt/aR9QaOQsY2Dhqcw4W30IL8O0s-zQlrkVQZbnQ52KS2Al5Po13elkVZJTo3GKcQn8gxFnYnUA18I8YXG7WhSZ_Q',
};

describe('QrCodeComponent', () => {
  let component: QrCodeComponent;
  let fixture: ComponentFixture<QrCodeComponent>;
  let service: DataService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletLayoutComponent, RouterModule, SharedModule],
      providers: [
        DataService,
        NavigateService,
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodeComponent);
    service = TestBed.inject(DataService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
