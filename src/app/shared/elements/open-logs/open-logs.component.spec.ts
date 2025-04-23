import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenLogsComponent } from './open-logs.component';
import { LogData } from './interfaces/LogData';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';

describe('OpenLogsComponent', () => {
  let component: OpenLogsComponent;
  let fixture: ComponentFixture<OpenLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenLogsComponent],
      providers: [
        provideHttpClient(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            transactionId: 'transactionId',
            label: 'test',
            isInspectLogs: false,
          } as LogData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
