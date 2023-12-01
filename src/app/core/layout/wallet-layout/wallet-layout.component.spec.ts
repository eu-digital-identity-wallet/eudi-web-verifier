import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletLayoutComponent } from './wallet-layout.component';

describe('WalletLayoutComponent', () => {
  let component: WalletLayoutComponent;
  let fixture: ComponentFixture<WalletLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // imports: [ WalletLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a <vc-wallet-layout-header>', () => {});
  it('should have a body-title', () => {});
  it('should have a body', () => {});
});
