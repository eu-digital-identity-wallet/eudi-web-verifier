import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'vc-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() isDisabled = false;
  @Input() name!: string;
  @Output() clicked: EventEmitter<string> = new EventEmitter();
  click () {
  	this.clicked.emit();
  }
}
