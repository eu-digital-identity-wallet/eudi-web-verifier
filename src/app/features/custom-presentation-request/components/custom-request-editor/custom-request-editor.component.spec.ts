import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { CustomRequestEditorComponent } from './custom-request-editor.component';
import { SharedModule } from '@app/shared/shared.module';

describe('PresentationRequestComponent', () => {
  let component: CustomRequestEditorComponent;
  let fixture: ComponentFixture<CustomRequestEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      providers: [provideNoopAnimations()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomRequestEditorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
