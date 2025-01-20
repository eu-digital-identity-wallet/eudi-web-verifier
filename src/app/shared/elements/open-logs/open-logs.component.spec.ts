import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenLogsComponent } from './open-logs.component';

describe('OpenLogsComponent', () => {
  let component: OpenLogsComponent;
  let fixture: ComponentFixture<OpenLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
