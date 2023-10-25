import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

	constructor (
    private readonly dataService: DataService
	) {}

	onRequest (code: string) {
  	this.dataService.presentationDefinitionRequest$.next(code);
	}

}
