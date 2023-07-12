import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { PresentationDefinitionResponse } from '@core/models/presentation-definition-response';
import { DataService } from '@app/core/services/data.service';
import { NavigateService } from '@app/core/services/navigate.service';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'vc-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

	constructor (
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly dataService: DataService,
    private readonly navigateService: NavigateService,
    private readonly presentationDefinitionService: PresentationDefinitionService
	) {}

	hideButton = true;
	invalidJSON = false;
	requestGenerate = false;
	buttonMode = 'none';
	requestCode = '';
	presentationDefinition$!: Observable<PresentationDefinitionResponse>;

	ngOnInit (): void {
		this.router.events
			.pipe(
				filter(event => event instanceof NavigationEnd )
			)
			.subscribe(() => {
				if (this.router.url.indexOf('create') > 0) {
					this.buttonMode = 'none';
					this.hideButton = true;
					this.changeDetectorRef.detectChanges();
				}
			});
		this.dataService.presentationDefinitionRequest$.subscribe((code) => {
			this.requestCode = code;
		});
	}
	goBack () {
		this.navigateService.goBack();
	}

	generateCode () {
		this.requestGenerate = true;
		if (this.requestCode) {
			this.buttonMode = 'loading';
			this.invalidJSON = false;
			this.presentationDefinitionService.generateCode(this.requestCode)
				.pipe(
					catchError((error) => {
						this.invalidJSON = true;
						return error;
					})
				)
				.subscribe((data) => {
					this.buttonMode = 'none';
					this.requestGenerate = false;
					this.dataService.setQRCode(data as PresentationDefinitionResponse);
					this.hideButton = false;
					this.navigateService.navigateTo('/presentation/verifiable');
					this.changeDetectorRef.detectChanges();
				});
		} else {
			this.invalidJSON = true;
		}
	}

}
