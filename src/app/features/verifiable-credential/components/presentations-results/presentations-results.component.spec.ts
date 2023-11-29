import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationsResultsComponent } from './presentations-results.component';

describe('PresentationsResultsComponent', () => {
  let component: PresentationsResultsComponent;
  let fixture: ComponentFixture<PresentationsResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentationsResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentationsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
