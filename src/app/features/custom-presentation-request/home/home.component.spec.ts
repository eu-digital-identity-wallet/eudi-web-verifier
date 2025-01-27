import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { WalletLayoutComponent } from '@core/layout/wallet-layout/wallet-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";

describe('Presentation Definition HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [HomeComponent],
    imports: [WalletLayoutComponent,
        RouterModule,
        SharedModule],
    providers: [
        VerifierEndpointService!,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
