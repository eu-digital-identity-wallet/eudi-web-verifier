import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { SharedModule } from '@app/shared/shared.module';

@Component({
	selector: 'vc-presentation-request',
	standalone: true,
	imports: [ CommonModule, SharedModule],
	templateUrl: './presentation-request.component.html',
	styleUrls: ['./presentation-request.component.scss']
})
export class PresentationRequestComponent {
  @Output() request: EventEmitter<string> = new EventEmitter();

  constructor (
    private readonly dataService: DataService
  ) {}

  onRequest (code: any) {
  	this.dataService.presentationDefinitionRequest$.next(code);
  	this.request.emit(code);
  }

}
