import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSchemeComponent } from './input-scheme.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('InputSchemeComponent', () => {
  let component: InputSchemeComponent;
  let fixture: ComponentFixture<InputSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputSchemeComponent,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        MatExpansionModule, FormsModule, ReactiveFormsModule, MatInputModule, SharedModule, MatIconModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
