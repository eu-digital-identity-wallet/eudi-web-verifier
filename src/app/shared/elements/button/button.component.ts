import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'vc-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() set mode (value: string) {
		if (value== 'loading') {
			this.buttonName = 'Loading...';
		} else {
			this.buttonName = this.name;
		}
	}
  @Input() isDisabled = false;
  @Input() name!: string;
  @Input() color: 'primary' | 'white' = 'primary';
  @Output() clicked: EventEmitter<string> = new EventEmitter();
  buttonName!: string;
  click () {
  	this.clicked.emit();
  }
}
