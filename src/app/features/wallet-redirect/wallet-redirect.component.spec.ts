import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { WalletRedirectComponent } from './wallet-redirect.component';
import { TransformedResponse } from '../verifiable-credential/models/TransformedResponse';
describe('WalletRedirectComponent', () => {
  let component: WalletRedirectComponent;
  let fixture: ComponentFixture<WalletRedirectComponent>;

  beforeEach(async () => {
    const data: TransformedResponse = {
      idToken: [
        { key: 'key', value: 'value'}
      ],
      vpToken: [
        { key: 'keyVp', value: 'valueVp'}
      ]
    };
    await TestBed.configureTestingModule({
      imports: [ WalletRedirectComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {data: {data: data}}
          }
        }
      ]
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
