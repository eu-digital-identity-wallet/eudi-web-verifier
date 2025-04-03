import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { SelectableAttestationAttributesComponent } from './selectable-attestation-attributes.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttestationType } from '@app/core/models/attestation/AttestationType';
import { format } from 'path';
import { AttestationFormat } from '@app/core/models/attestation/AttestationFormat';

describe('CBOR CreateAScenarioComponent', () => {
  let component: SelectableAttestationAttributesComponent;
  let fixture: ComponentFixture<SelectableAttestationAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WalletLayoutComponent,
        RouterModule,
        SharedModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        SharedModule,
        MatCheckboxModule,
        SelectableAttestationAttributesComponent,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            type: AttestationType.MDL,
            format: AttestationFormat.MSO_MDOC,
            attestationName: 'MDL',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectableAttestationAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
