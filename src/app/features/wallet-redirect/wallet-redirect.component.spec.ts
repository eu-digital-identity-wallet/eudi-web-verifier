import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { WalletRedirectComponent } from './wallet-redirect.component';
import {WalletResponse} from "@core/models/WalletResponse";
describe('WalletRedirectComponent', () => {
  let component: WalletRedirectComponent;
  let fixture: ComponentFixture<WalletRedirectComponent>;

  beforeEach(async () => {
    const data: WalletResponse = {
      presentation_submission: undefined,
      id_token: "id_token",
      vp_token: [ "vp_token" ]
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
