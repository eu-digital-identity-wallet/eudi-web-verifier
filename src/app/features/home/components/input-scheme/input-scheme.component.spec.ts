import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSchemeComponent } from './input-scheme.component';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

describe('InputSchemeComponent', () => {
  let component: InputSchemeComponent;
  let fixture: ComponentFixture<InputSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputSchemeComponent,
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
