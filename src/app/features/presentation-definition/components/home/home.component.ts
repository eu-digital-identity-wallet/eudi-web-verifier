import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpService } from '@network/http/http.service';
import { Observable, map } from 'rxjs';
import { PresentationDefinitionResponse } from '../../models/presentation-definition-response';
import { DataService } from '@app/core/services/data.service';
import { NavigateService } from '@app/core/services/navigate.service';

@Component({
	selector: 'vc-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

	constructor (
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly dataService: DataService,
    private readonly navigateService: NavigateService
	) {}
	hideButton = true;
	invalidJSON = false;
	requestGenerate = false;
	buttonMode = 'none';
	requestCode = null;
	presentationDefinition$!: Observable<PresentationDefinitionResponse>;

	ngOnInit (): void {
		this.dataService.presentationDefinitionRequest$.subscribe((code) => {
			this.requestCode = code;
			console.log(code);
		});
	}
	requestedCode (code: any) {
		this.requestCode = code;
	}
	generateCode () {
		this.requestGenerate = true;
		if (this.requestCode && this.isJSON(this.requestCode)) {
			this.buttonMode = 'loading';
			this.invalidJSON = false;
			const payload = JSON.parse(this.requestCode);
			this.httpService.post('ui/presentations', payload).
				pipe(
					map((data) => {
						this.buttonMode = 'none';
						this.requestGenerate = false;
						this.changeDetectorRef.detectChanges();
						this.dataService.setQRCode(data);
						return data;
					} )
				).subscribe(() => {
					this.hideButton = false;
					this.navigateService.navigateTo('/presentation/verifiable');
				});
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
