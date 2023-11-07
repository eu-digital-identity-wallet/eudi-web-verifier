import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LayoutComponent } from '@app/core/layout/layout/layout.component';
import { CborDecodeService } from '@app/core/services/cbor/cbor-decode.service';
import { DataService } from '@app/core/services/data.service';
import { NavigateService } from '@app/core/services/navigate.service';
import { OnlineAuthenticationSIOPService } from '@app/core/services/online-authentication-siop.service';
import { RadioGroupComponent } from '@app/shared/elements/radio-group/radio-group.component';
import { SharedModule } from '@app/shared/shared.module';

@Component({
	selector: 'vc-home',
	standalone: true,
	imports: [CommonModule, RadioGroupComponent, SharedModule, LayoutComponent],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	providers: [OnlineAuthenticationSIOPService, CborDecodeService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

	constructor (
    private navigateService: NavigateService,
    private readonly onlineAuthenticationSIOPService: OnlineAuthenticationSIOPService,
    private readonly dataService: DataService,
    private readonly cborDecodeService: CborDecodeService
	) {
	}
	ngOnInit (): void {
		this.cborDecodeService.test();
	}

	navPath = '';
	disableButton = true;
	options = [{
		key: 'SIOP',
		value: 'Online Authentication  (SIOP)',
		isDisabled: false,
	},
	{
		key: 'OID4VP_CBOR',
		value: 'OID4VP + CBOR',
		isDisabled: false,
	},
	{
		key: 'OID4VP_C',
		value: 'OID4VP Custom',
		isDisabled: false,
	}
	];
	navigate (choose: string) {
		this.disableButton = false;
		if (choose === 'SIOP') {
			this.navPath = 'siop';
		} else if (choose === 'OID4VP_CBOR') {
			this.navPath = 'cbor';
		} else if (choose === 'OID4VP_C') {
			this.navPath = '/presentation';
		}

	}
	submit () {
		if (this.navPath === '/presentation') {
			this.navigateService.navigateTo(this.navPath);
		} else if (this.navPath === 'siop') {
			this.onlineAuthenticationSIOPService.initTransaction().subscribe((data) => {
				this.dataService.setQRCode(data);
				this.navigateService.navigateTo(this.navPath);
			});
		} else if(this.navPath === 'cbor') {
			this.onlineAuthenticationSIOPService.initCborTransaction().subscribe((data) => {
				this.dataService.setQRCode(data);
				this.navigateService.navigateTo(this.navPath);
			});
		}
	}
}
