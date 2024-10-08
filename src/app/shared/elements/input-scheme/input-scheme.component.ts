import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from './error-state-matcher';
import { SharedModule } from '@shared/shared.module';
import { LocalStorageService } from '@core/services/local-storage.service';
import { DEFAULT_SCHEME, SCHEME } from '@core/constants/general';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
	selector: 'vc-input-scheme',
	standalone: true,
  imports: [CommonModule, MatExpansionModule, FormsModule, ReactiveFormsModule, MatInputModule, SharedModule, MatIconModule, MatDialogModule, MatButtonModule],
	templateUrl: './input-scheme.component.html',
	styleUrls: ['./input-scheme.component.scss']
})
export class InputSchemeComponent implements OnInit {


	readonly localStorageService: LocalStorageService = inject(LocalStorageService);
	schemePattern = '([a-zA-Z0-9-]{2,20})://';
	schemeControl = new FormControl('', [Validators.required]);
	matcher = new ErrorStateMatcher();

	schemeValue!: string;

	ngOnInit (): void {
		this.schemeValue = this.localStorageService.get(SCHEME) || DEFAULT_SCHEME;
	}

	save () {
		console.log(this.schemeControl);
		const {value} = this.schemeControl;
		if (value) {
			this.localStorageService.set(SCHEME, value);
			this.schemeValue = value;
		}
	}
}
