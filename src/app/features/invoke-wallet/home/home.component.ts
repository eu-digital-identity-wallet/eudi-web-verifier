import { Component } from '@angular/core';
import { NavigateService } from '@app/core/services/navigate.service';
import { BACK_ONLY_ACTIONS } from '@core/constants/pages-actions';
import { ActionCode } from '@app/shared/elements/body-actions/models/ActionCode';
import { BodyAction } from '@app/shared/elements/body-actions/models/BodyAction';

@Component({
    selector: 'vc-home',
    templateUrl: './home.component.html',
    standalone: false
})
export class HomeComponent {
	constructor (
    private readonly navigateService: NavigateService,
	) {}

	actions: BodyAction[] = BACK_ONLY_ACTIONS;

	runActions (data: BodyAction) {
		if (data.code === ActionCode.BACK) {
			this.navigateService.goBack();
		}
	}
}
