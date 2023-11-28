import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyActionsComponent } from './body-actions.component';

describe('BodyActionsComponent', () => {
  let component: BodyActionsComponent;
  let fixture: ComponentFixture<BodyActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BodyActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
