import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {SharedModule} from '@app/shared/shared.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {EventLog} from '@core/models/EventLog';
import {Observable, of} from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";

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
	providers: [VerifierEndpointService]
})
export class ShowLogsComponent implements OnInit {
  @Input() transactionId!: string;
  logs$: Observable<EventLog[]> = of([]);

  constructor (
        private verifierEndpointService: VerifierEndpointService
  ) {}
  ngOnInit (): void {
  	this.logs$ = this.verifierEndpointService.getsTransactionEventsLogs(this.transactionId);
  }
  trackByFn (_index: number, data: EventLog) {
  	return data.timestamp;
  }
}
