import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { PresentationDefinitionResponse } from '@core/models/presentation-definition-response';
import { DataService } from '@app/core/services/data.service';
import { NavigateService } from '@app/core/services/navigate.service';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { NavigationEnd, Router } from '@angular/router';
import { BodyAction } from '@app/shared/elements/body-actions/models/BodyAction';
import { PRESENTATION_ACTIONS } from '@app/core/utils/pages-actions';
import { ActionCode } from '@app/shared/elements/body-actions/models/ActionCode';

@Component({
	selector: 'vc-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {

	destroy$ = new Subject();
	actions: BodyAction[] = PRESENTATION_ACTIONS;
	requestCode = '';
	presentationDefinition$!: Observable<PresentationDefinitionResponse>;
	constructor (
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly dataService: DataService,
    private readonly navigateService: NavigateService,
    private readonly presentationDefinitionService: PresentationDefinitionService
	) {}
	ngOnDestroy (): void {
		this.destroy$.next('');
		this.destroy$.complete();
	}
	ngOnInit (): void {
		this.dataService.presentationDefinitionRequest$.subscribe((code) => {
			this.requestCode = code;
			this.disableNextButton(code);
		});
		this.router.events
			.pipe(
				takeUntil(this.destroy$),
				filter((event): event is NavigationEnd => event instanceof NavigationEnd)
			)
			.subscribe((event) => {
				if (event.url.includes('custom-request/create')) {
					this.actions = PRESENTATION_ACTIONS;
					this.requestCode = '';
					this.disableNextButton(this.requestCode);
					this.changeDetectorRef.detectChanges();
				}
			});
	}

	runActions (data: BodyAction) {
		if (data.code === ActionCode.BACK) {
			this.navigateService.goBack();
		} else if (data.code === ActionCode.NEXT) {
			this.generateCode();
		}
	}

	generateCode () {
		if (this.requestCode) {
			this.presentationDefinitionService.generateCode(this.requestCode)
				.subscribe((data) => {
					this.hideNextStep();
					this.dataService.setQRCode(data as PresentationDefinitionResponse);
					this.navigateService.navigateTo('/custom-request/verifiable');
					this.changeDetectorRef.detectChanges();
				});
		} else {
			console.error('invalid JSON format');
		}
	}

	private disableNextButton (code: string) {
		[...this.actions].map((item: BodyAction) => {
			if (code && item.code == ActionCode.NEXT) {
				item.disabled = false;
			} else if(item.code == ActionCode.NEXT) {
				item.disabled = true;
			}
			return item;
		});
	}
	private hideNextStep () {
		this.actions = this.actions.filter((item: BodyAction) => item.code !== ActionCode.NEXT);
	}
}
