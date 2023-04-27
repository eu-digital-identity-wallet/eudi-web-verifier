import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '@network/http/http.service';
import { Observable, map } from 'rxjs';
import { PresentationDefinitionResponse } from '../../models/presentation-definition-response';

@Component({
	selector: 'vc-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

	constructor (
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef
	) {}

	invalidJSON = false;
	requestGenerate = false;
	buttonMode = 'none';
	requestCode = null;
	presentationDefinition$!: Observable<PresentationDefinitionResponse>;

	requestedCode (code: any) {
		this.requestCode = code;
	}
	generateCode () {
		this.requestGenerate = true;
		if (this.requestCode && this.isJSON(this.requestCode)) {
			this.buttonMode = 'loading';
			this.invalidJSON = false;
			const payload = JSON.parse(this.requestCode);
			this.presentationDefinition$ = this.httpService.post('ui/presentations', payload).
				pipe(
					map((data) => {
						this.buttonMode = 'none';
						this.requestGenerate = false;
						this.changeDetectorRef.detectChanges();
						return data;
					} )
				);
		} else {
			this.invalidJSON = true;
		}
	}

	isJSON (requestCode: string) {
		try {
			return (JSON.parse(requestCode) && !!requestCode);
		} catch (e) {
			return false;
		}
	}
}
