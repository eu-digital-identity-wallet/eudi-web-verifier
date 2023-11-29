import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { isJSON } from '@app/core/utils/ValidationJSON';
import { SharedModule } from '@app/shared/shared.module';

@Component({
	selector: 'vc-presentation-request',
	standalone: true,
	imports: [ CommonModule, SharedModule],
	templateUrl: './presentation-request.component.html',
	styleUrls: ['./presentation-request.component.scss']
})
export class PresentationRequestComponent {

	invalidJSON = true;
	constructor (
    private readonly dataService: DataService
	) {}

	onRequest (code: string) {
		this.invalidJSON = code.length === 0 || isJSON(code);
  	this.dataService.presentationDefinitionRequest$.next(code);
	}

}
