import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletRedirectComponent } from './wallet-redirect.component';

describe('WalletRedirectComponent', () => {
  let component: WalletRedirectComponent;
  let fixture: ComponentFixture<WalletRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WalletRedirectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
