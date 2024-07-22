import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { SelectablePresentationFormComponent } from './selectable-presentation-form.component';
import { HttpClientModule } from '@angular/common/http';
import { SelectableFormNextAction } from '../../services/selectable-form-next-action.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('CBOR CreateAScenarioComponent', () => {
  let component: SelectablePresentationFormComponent;
  let fixture: ComponentFixture<SelectablePresentationFormComponent>;

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
      declarations: [ SelectablePresentationFormComponent ],
      providers: [
        SelectableFormNextAction
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectablePresentationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
