import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { PresentationOptionsDcApiComponent } from './presentation-options-dc-api.component';

describe('PresentationOptionsDcApiComponent', () => {
  let component: PresentationOptionsDcApiComponent;
  let fixture: ComponentFixture<PresentationOptionsDcApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentationOptionsDcApiComponent],
      providers: [provideNoopAnimations()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentationOptionsDcApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
