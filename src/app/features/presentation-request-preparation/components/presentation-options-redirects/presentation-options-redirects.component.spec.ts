import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { PresentationOptionsRedirectsComponent } from './presentation-options-redirects.component';

describe('PresentationOptionsComponent', () => {
  let component: PresentationOptionsRedirectsComponent;
  let fixture: ComponentFixture<PresentationOptionsRedirectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentationOptionsRedirectsComponent],
      providers: [provideNoopAnimations()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentationOptionsRedirectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
