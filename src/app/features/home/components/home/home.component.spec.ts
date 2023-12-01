import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpService } from '@app/core/network/http/http.service';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { SharedModule } from '@app/shared/shared.module';
import { HomeService } from '../../services/home.service';
import { OnlineAuthenticationSIOPService } from '@app/core/services/online-authentication-siop.service';
import { DataService } from '@app/core/services/data.service';
import { HttpClientModule } from '@angular/common/http';

describe('CBOR HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // declarations: [ HomeComponent ]
      imports: [
        SharedModule, WalletLayoutComponent, HttpClientModule
      ],
      providers: [
        // HttpService
        DataService,
        OnlineAuthenticationSIOPService,
        HomeService
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
