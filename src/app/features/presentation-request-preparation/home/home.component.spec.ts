import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { SharedModule } from '@app/shared/shared.module';
import { AttestationSelection, AttributeSelectionMethod } from '../models/AttestationSelection';
import { TransactionInitializationRequest } from '@app/core/models/TransactionInitializationRequest';
import { AttestationFormat } from '@app/core/models/attestation/AttestationFormat';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WalletLayoutComponent,
        RouterModule,
        SharedModule,
        HomeComponent
      ],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideAnimations()
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle jar method change and update initializationRequest', () => {
    const mockSelectedAttestations = [{ format: AttestationFormat.MSO_MDOC, attributeSelectionMethod: AttributeSelectionMethod.ALL_ATTRIBUTES }] as AttestationSelection[];
    const mockSelectedAttributes = { mockId: ['mockValue'] };
    const mockSelectedJarMethod = 'post';
    const mockInitializationRequest = {} as TransactionInitializationRequest;
  
    component.selectedAttestations = mockSelectedAttestations;
    component.selectedAttributes = mockSelectedAttributes;
    spyOn(component as any, 'prepareInitializationRequest').and.returnValue(mockInitializationRequest);
  
    component.handleRequestUriMethodChangedEvent(mockSelectedJarMethod);
  
    expect(component.selectedRequestUriMethod).toBe(mockSelectedJarMethod);
    expect(component.initializationRequest).toBe(mockInitializationRequest);
  });

});
