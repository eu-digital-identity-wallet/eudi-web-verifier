import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { RadioGroupModel } from './radio-group.model';

@Component({
	selector: 'vc-radio-group',
	standalone: true,
	imports: [
		CommonModule,
		MatRadioModule,
		FormsModule,
	],
	templateUrl: './radio-group.component.html',
	styleUrls: ['./radio-group.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: MAT_RADIO_DEFAULT_OPTIONS,
			useValue: { color: 'primary' },
		}
	]
})
export class RadioGroupComponent {
	chose!: string;
	@Output() choseEvent: EventEmitter<string> = new EventEmitter();
	@Input() options: RadioGroupModel[] = [];
	selected () {
		this.choseEvent.emit(this.chose);
	}
}
