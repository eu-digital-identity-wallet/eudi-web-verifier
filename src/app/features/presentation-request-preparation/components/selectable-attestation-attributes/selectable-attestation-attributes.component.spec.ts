import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { SelectableAttestationAttributesComponent } from './selectable-attestation-attributes.component';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('CBOR CreateAScenarioComponent', () => {
  let component: SelectableAttestationAttributesComponent;
  let fixture: ComponentFixture<SelectableAttestationAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WalletLayoutComponent,
        RouterModule,
        SharedModule,
        HttpClientModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        SharedModule,
        MatCheckboxModule,
      ],
      declarations: [ SelectableAttestationAttributesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectableAttestationAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
