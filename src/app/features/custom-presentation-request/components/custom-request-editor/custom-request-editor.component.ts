import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { SharedModule } from '@app/shared/shared.module';

@Component({
    selector: 'vc-presentation-request-editor',
    imports: [CommonModule, SharedModule],
    templateUrl: './custom-request-editor.component.html',
    styleUrls: ['./custom-request-editor.component.scss']
})
export class CustomRequestEditorComponent {

	invalidJSON = true;
	constructor (
    private readonly dataService: DataService
	) {}

	onRequest (code: string) {
		this.invalidJSON = code.length === 0 || this.isJSON(code);
  	this.dataService.presentationDefinitionRequest$.next(code);
	}

  isJSON (requestCode: string) {
    try {
      return (JSON.parse(requestCode) && !!requestCode);
    } catch (e) {
      return false;
    }
  }

}
