import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from './error-state-matcher';
import { SharedModule } from '@app/shared/shared.module';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { SCHEME } from '@app/core/constants/constants';

@Component({
	selector: 'vc-input-scheme',
	standalone: true,
	imports: [CommonModule, MatExpansionModule, FormsModule, ReactiveFormsModule, MatInputModule, SharedModule, MatIconModule],
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
		const storedValue = this.localStorageService.get(SCHEME);
		if (storedValue) {
			this.schemeValue = storedValue;
		}
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
