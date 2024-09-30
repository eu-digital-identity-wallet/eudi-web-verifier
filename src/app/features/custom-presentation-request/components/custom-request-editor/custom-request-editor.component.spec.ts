import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRequestEditorComponent } from './custom-request-editor.component';
import { SharedModule } from '@app/shared/shared.module';

describe('PresentationRequestComponent', () => {
  let component: CustomRequestEditorComponent;
  let fixture: ComponentFixture<CustomRequestEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      // declarations: [ PresentationRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomRequestEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
