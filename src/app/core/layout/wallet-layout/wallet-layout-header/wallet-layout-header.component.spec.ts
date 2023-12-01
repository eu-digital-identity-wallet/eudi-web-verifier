import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletLayoutHeaderComponent } from './wallet-layout-header.component';
import { NavigateService } from '@app/core/services/navigate.service';

describe('WalletLayoutHeaderComponent', () => {
  let component: WalletLayoutHeaderComponent;
  let fixture: ComponentFixture<WalletLayoutHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // declarations: [ WalletLayoutHeaderComponent ]2
      providers: [
        NavigateService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletLayoutHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have an logo', () => {});
});
