import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'vc-presentation-request',
	templateUrl: './presentation-request.component.html',
	styleUrls: ['./presentation-request.component.scss']
})
export class PresentationRequestComponent {
  @Output() request: EventEmitter<string> = new EventEmitter();

  onRequest (code: any) {
  	this.request.emit(code);
  }

}
