import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '@app/core/services/data.service';
import { NavigateService } from '@app/core/services/navigate.service';
import { OnlineAuthenticationSIOPService } from '@app/core/services/online-authentication-siop.service';
import { RadioGroupComponent } from '@app/shared/elements/radio-group/radio-group.component';
import { SharedModule } from '@app/shared/shared.module';
import { HomeService } from '../../services/home.service';
import { MenuOption } from '../../models/menu-option';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { BodyAction } from '@app/shared/elements/body-actions/models/BodyAction';
import { HOME_ACTIONS } from '@app/core/utils/pages-actions';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import * as constants from '@core/constants/constants';
import { InputSchemeComponent } from '../input-scheme/input-scheme.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
	standalone: true,
	imports: [CommonModule, MatTabsModule, RadioGroupComponent, SharedModule, InputSchemeComponent, WalletLayoutComponent],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	providers: [OnlineAuthenticationSIOPService, HomeService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

	actions: BodyAction[] = HOME_ACTIONS;
	optionsCustomRequest: MenuOption[] = [];
	optionsPIDAuthentication: MenuOption[] = [];
	optionsAgeVerification: MenuOption[] = [];
	constructor (
    private navigateService: NavigateService,
    private readonly onlineAuthenticationSIOPService: OnlineAuthenticationSIOPService,
    private readonly dataService: DataService,
    private readonly homeService: HomeService,
    private readonly localStorageService: LocalStorageService
	) {
		this.localStorageService.remove(constants.UI_PRESENTATION);
	}
	ngOnInit (): void {
		this.optionsCustomRequest = this.homeService.optionsCustomRequest;
		this.optionsPIDAuthentication = this.homeService.optionsPIDAuthentication;
		this.optionsAgeVerification = this.homeService.optionsAgeVerification;
	}

	private navPath = '';

	navigate (choose: string) {
		if (choose === 'SIOP') {
			this.navPath = 'siop';
		} else if (choose === 'OID4VP_CBOR') {
			this.navPath = 'cbor';
		} else if (choose === 'OID4VP_C') {
			this.navPath = '/presentation';
		} else if (choose === 'OID4VP_CBOR_Selectable') {
			this.navPath = 'cbor-selectable/create';
		} else if (choose === 'OID4VP_attestation') {
			this.navPath = 'age-attestation';
		} else if (choose === 'OID4VP_age_over_18') {
			this.navPath = 'age-over-18';
		}
		this.actions = [...this.actions].map((item) => {
			item.disabled = false;
			return item;
		});
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
		} else if (this.navPath === 'cbor-selectable/create') {
			this.navigateService.navigateTo(this.navPath);
		} else if (this.navPath === 'age-over-18') {
			this.onlineAuthenticationSIOPService.initAgeOver18Transaction().subscribe((data) => {
				this.dataService.setQRCode(data);
				this.navigateService.navigateTo(this.navPath);
			});
		} else if (this.navPath === 'age-attestation') {
			this.onlineAuthenticationSIOPService.initAgeOver18AttestationTransaction().subscribe((data) => {
				this.dataService.setQRCode(data);
				this.navigateService.navigateTo(this.navPath);
			});
		}
	}
	selectedIndexChange (_event: number) {
		this.actions = [...this.actions].map((item) => {
			item.disabled = true;
			return item;
		});
	}
}
