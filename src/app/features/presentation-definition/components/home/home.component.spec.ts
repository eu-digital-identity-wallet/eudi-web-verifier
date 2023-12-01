import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { HttpClientModule } from '@angular/common/http';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';

describe('Presentation Definition HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        WalletLayoutComponent,
        RouterModule,
        SharedModule
      ],
      declarations: [ HomeComponent ],
      providers: [
        PresentationDefinitionService!
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
