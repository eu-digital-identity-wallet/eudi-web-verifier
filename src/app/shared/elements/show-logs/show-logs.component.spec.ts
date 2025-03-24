import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLogsComponent } from './show-logs.component';
import { SharedModule } from '@app/shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { provideHttpClient } from '@angular/common/http';

describe('ShowLogsComponent', () => {
  let component: ShowLogsComponent;
  let fixture: ComponentFixture<ShowLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ShowLogsComponent, SharedModule, MatExpansionModule],
      providers: [PresentationDefinitionService, provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
