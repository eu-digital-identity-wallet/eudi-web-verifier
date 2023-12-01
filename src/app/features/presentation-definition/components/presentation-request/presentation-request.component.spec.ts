import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationRequestComponent } from './presentation-request.component';
import { SharedModule } from '@app/shared/shared.module';

describe('PresentationRequestComponent', () => {
  let component: PresentationRequestComponent;
  let fixture: ComponentFixture<PresentationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      // declarations: [ PresentationRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
