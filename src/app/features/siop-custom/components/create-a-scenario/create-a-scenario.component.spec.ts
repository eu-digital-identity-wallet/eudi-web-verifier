import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { CreateAScenarioComponent } from './create-a-scenario.component';
import { HttpClientModule } from '@angular/common/http';
import { HelperCborSelectableService } from '../../services/helper-cbor-selectable.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('CBOR CreateAScenarioComponent', () => {
  let component: CreateAScenarioComponent;
  let fixture: ComponentFixture<CreateAScenarioComponent>;

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
      declarations: [ CreateAScenarioComponent ],
      providers: [
        HelperCborSelectableService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
