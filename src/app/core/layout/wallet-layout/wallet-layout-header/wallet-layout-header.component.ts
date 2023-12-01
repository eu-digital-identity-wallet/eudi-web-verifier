import { Component } from '@angular/core';
import { NavigateService } from '@app/core/services/navigate.service';

@Component({
	selector: 'vc-wallet-layout-header',
	standalone: true,
	templateUrl: './wallet-layout-header.component.html',
	styleUrls: ['./wallet-layout-header.component.scss']
})
export class WalletLayoutHeaderComponent {
	constructor (private readonly navigateService: NavigateService) {}

	goHome () {
		this.navigateService.goHome();
	}
}
