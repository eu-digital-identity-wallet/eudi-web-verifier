import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationOptionsComponent } from './presentation-options.component';

describe('PresentationOptionsComponent', () => {
  let component: PresentationOptionsComponent;
  let fixture: ComponentFixture<PresentationOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentationOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
