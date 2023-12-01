import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationsResultsComponent } from './presentations-results.component';
import { MatListModule } from '@angular/material/list';

describe('PresentationsResultsComponent', () => {
  let component: PresentationsResultsComponent;
  let fixture: ComponentFixture<PresentationsResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // declarations: [ PresentationsResultsComponent ]
      imports: [
        MatListModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentationsResultsComponent);
    component = fixture.componentInstance;
    component.results = {
      idToken: [{key: 'bla', value: 'bla'}],
      vpToken: [{key: 'bla', value: 'bla'}],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
