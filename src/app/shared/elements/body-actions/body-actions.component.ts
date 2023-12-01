import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BodyAction } from './models/BodyAction';

@Component({
	selector: 'vc-body-actions',
	templateUrl: './body-actions.component.html',
	styleUrls: ['./body-actions.component.scss']
})
export class BodyActionsComponent {

  @Input() actions: BodyAction[] = [];
  @Output() clicked: EventEmitter<BodyAction> = new EventEmitter();
  runClick (action: BodyAction) {
  	this.clicked.emit(action);
  }
}
