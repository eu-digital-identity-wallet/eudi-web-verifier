import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletLayoutHeaderComponent } from './wallet-layout-header.component';

describe('WalletLayoutHeaderComponent', () => {
  let component: WalletLayoutHeaderComponent;
  let fixture: ComponentFixture<WalletLayoutHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletLayoutHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletLayoutHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
