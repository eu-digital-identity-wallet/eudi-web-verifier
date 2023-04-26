import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiableCredentialComponent } from './verifiable-credential.component';

describe('VerifiableCredentialComponent', () => {
  let component: VerifiableCredentialComponent;
  let fixture: ComponentFixture<VerifiableCredentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifiableCredentialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifiableCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
