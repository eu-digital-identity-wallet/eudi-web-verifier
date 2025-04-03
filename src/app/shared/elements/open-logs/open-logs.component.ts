import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ShowLogsComponent } from '../show-logs/show-logs.component';
import { LogData } from './interfaces/LogData';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '@app/shared/shared.module';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";

@Component({
    selector: 'vc-open-logs',
    imports: [
        MatDialogModule,
        CommonModule,
        MatButtonModule,
        ShowLogsComponent,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        SharedModule,
        MatExpansionModule
    ],
    templateUrl: './open-logs.component.html',
    styleUrls: ['./open-logs.component.scss'],
    providers: [VerifierEndpointService]
})
export class OpenLogsComponent implements OnInit {
	readonly data = inject<LogData>(MAT_DIALOG_DATA);
	transactionId!: string;
	label = 'Show Logs';
	isInspectLogs = false;
	schemeControl = new FormControl('', [Validators.required]);
	matcher = new ErrorStateMatcher();

	ngOnInit (): void {
		this.transactionId = this.data.transactionId;
		this.label = this.data.label;
		this.isInspectLogs = this.data.isInspectLogs;
	}
	inspectLogs () {
		this.transactionId = '';
		setTimeout(() => {
			this.transactionId = this.schemeControl.value ?? '';
		}, 1);

	}
}
