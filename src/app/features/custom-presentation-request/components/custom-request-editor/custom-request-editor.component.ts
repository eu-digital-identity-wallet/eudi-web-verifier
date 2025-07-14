import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

@Component({
    selector: 'vc-presentation-request-editor',
    imports: [CommonModule, SharedModule],
    templateUrl: './custom-request-editor.component.html',
    styleUrls: ['./custom-request-editor.component.scss']
})
export class CustomRequestEditorComponent {

	invalidJSON = true;
	constructor () {}

	onRequest (code: string) {
		this.invalidJSON = code.length === 0 || this.isJSON(code);
	}

  isJSON (requestCode: string) {
    try {
      return (JSON.parse(requestCode) && !!requestCode);
    } catch (e) {
      return false;
    }
  }

}
