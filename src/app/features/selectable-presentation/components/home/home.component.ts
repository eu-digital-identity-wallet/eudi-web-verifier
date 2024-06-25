import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CBOR_ACTIONS } from '@app/core/utils/pages-actions';
import { ActionCode } from '@app/shared/elements/body-actions/models/ActionCode';
import { BodyAction } from '@app/shared/elements/body-actions/models/BodyAction';
import { HelperCborSelectableService } from '../../services/helper-cbor-selectable.service';
import { NavigateService } from '@app/core/services/navigate.service';

@Component({
	selector: 'vc-home',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

	actions: BodyAction[] = CBOR_ACTIONS;
	isCreatePage = true;
	constructor (
    private readonly helperCborSelectableService: HelperCborSelectableService,
    private readonly navigateService: NavigateService,
    private readonly router: Router
	) {}
	ngOnInit (): void {
		this.router.events
			.pipe(
				filter((event): event is NavigationEnd => event instanceof NavigationEnd)
			)
			.subscribe((event) => {
				this.isCreatePage = event.url.includes('verifiable') ? false : true;
				if (this.isCreatePage) {
					this.actions = CBOR_ACTIONS;
				}
			});
	}

	runActions (data: BodyAction) {
		if (data.code === ActionCode.NEXT) {
			this.helperCborSelectableService.goNextStep$.next('go next');
			this.actions = this.actions.filter((item) => item.code !== ActionCode.NEXT);
		} else if(data.code === ActionCode.BACK) {
			this.navigateService.goBack();
		}
	}
}
