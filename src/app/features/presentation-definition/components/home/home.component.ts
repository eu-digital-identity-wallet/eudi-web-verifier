import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpService } from '@network/http/http.service';
import { Observable } from 'rxjs';
import { PresentationDefinitionResponse } from '../../models/presentation-definition-response';

@Component({
	selector: 'vc-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

	constructor (
    private readonly httpService: HttpService
	) {}

	requestCode = null;
	presentationDefinition$!: Observable<PresentationDefinitionResponse>;

	requestedCode (code: any) {
		this.requestCode = code;
	}
	generateCode () {
		console.log('code', this.requestCode);
		if (this.requestCode) {
			const payload = JSON.parse(this.requestCode);
			console.log('payload: ', payload);
			this.presentationDefinition$ = this.httpService.post('ui/presentations', payload);
		}
	}
}
