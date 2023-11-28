import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { PresentationDefinitionResponse } from '@core/models/presentation-definition-response';
import { DataService } from '@app/core/services/data.service';
import { NavigateService } from '@app/core/services/navigate.service';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BodyAction } from '@app/shared/elements/body-actions/models/BodyAction';
import { PRESENTATION_ACTIONS } from '@app/core/utils/pages-actions';
import { ActionCode } from '@app/shared/elements/body-actions/models/ActionCode';

@Component({
	selector: 'vc-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {


	actions: BodyAction[] = PRESENTATION_ACTIONS;
	hideButton = true;
	invalidJSON = false;
	requestGenerate = false;
	buttonMode = 'none';
	requestCode = '';
	presentationDefinition$!: Observable<PresentationDefinitionResponse>;
	constructor (
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly dataService: DataService,
    private readonly navigateService: NavigateService,
    private readonly presentationDefinitionService: PresentationDefinitionService
	) {}
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
			console.log(code);
			this.actions.map((item: BodyAction) => {
				if (code && item.code == ActionCode.NEXT) {
					item.disabled = false;
				} else if(item.code == ActionCode.NEXT) {
					item.disabled = true;
				}
				return item;
			});
		});
	}
	goBack () {
		this.navigateService.goBack();
	}

	runActions (data: BodyAction) {
		console.log(data);
		if (data.code === ActionCode.BACK) {
			this.navigateService.goBack();
		} else if (data.code === ActionCode.NEXT) {
			this.generateCode();
		}
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
