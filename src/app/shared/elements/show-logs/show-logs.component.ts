import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { EventLog } from '@app/core/models/event-log';
import { Observable, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'vc-show-logs',
	standalone: true,
	imports: [
		CommonModule,
		SharedModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatInputModule
	],
	templateUrl: './show-logs.component.html',
	styleUrls: ['./show-logs.component.scss'],
	providers: [PresentationDefinitionService]
})
export class ShowLogsComponent implements OnInit {
  @Input() transactionId!: string;
  logs$: Observable<EventLog[]> = of([]);

  constructor (
        private presentationDefinitionService: PresentationDefinitionService
  ) {}
  ngOnInit (): void {
  	this.logs$ = this.presentationDefinitionService.getsTransactionEventsLogs(this.transactionId);
  }
  trackByFn (_index: number, data: EventLog) {
  	return data.timestamp;
  }
}
