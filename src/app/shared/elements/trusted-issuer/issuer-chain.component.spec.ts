import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuerChainComponent } from './issuer-chain.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('IssuerChainComponent', () => {
  let component: IssuerChainComponent;
  let fixture: ComponentFixture<IssuerChainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuerChainComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(IssuerChainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
