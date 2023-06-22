import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigateService } from '@app/core/services/navigate.service';

@Component({
	selector: 'vc-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
	constructor (
    private navigateService: NavigateService
	) {}
	navPath = '';
	options = [{
		key: 'SIOP',
		value: 'Online Authentication  (SIOP)'
	},
	{
		key: 'OID4VP_CBOR',
		value: 'OID4VP + CBOR'
	},
	{
		key: 'OID4VP_C',
		value: 'OID4VP Custom'
	}
	];
	navigate (choose: string) {
		if (choose === 'SIOP') {
			this.navPath = '';
		} else if (choose === 'OID4VP_CBOR') {
			this.navPath = '';
		} else if (choose === 'OID4VP_C') {
			this.navPath = '/presentation';
		}

	}
	submit () {
		console.log('choose: ', this.navPath);
		if (this.navPath) {
			this.navigateService.navigateTo(this.navPath);
		}
	}
}
