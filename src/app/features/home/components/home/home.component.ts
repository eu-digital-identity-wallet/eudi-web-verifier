import {ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataService} from '@app/core/services/data.service';
import {NavigateService} from '@app/core/services/navigate.service';
import {OnlineAuthenticationSIOPService} from '@app/core/services/online-authentication-siop.service';
import {RadioGroupComponent} from '@app/shared/elements/radio-group/radio-group.component';
import {SharedModule} from '@app/shared/shared.module';
import {HomeService} from '../../services/home.service';
import {MenuOption} from '../../models/menu-option';
import {WalletLayoutComponent} from '@app/core/layout/wallet-layout/wallet-layout.component';
import {BodyAction} from '@app/shared/elements/body-actions/models/BodyAction';
import {HOME_ACTIONS} from '@app/core/utils/pages-actions';
import {LocalStorageService} from '@app/core/services/local-storage.service';
import * as constants from '@core/constants/constants';
import {InputSchemeComponent} from '../input-scheme/input-scheme.component';
import {MatTabsModule} from '@angular/material/tabs';
import {AttestationSelectableModelService} from '@app/core/services/attestation-selectable-model.service';
import { OpenLogsComponent } from '@app/shared/elements/open-logs/open-logs.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
	standalone: true,
	imports: [
		CommonModule,
		MatTabsModule,
		RadioGroupComponent,
		SharedModule,
		InputSchemeComponent,
		WalletLayoutComponent,
		OpenLogsComponent,
		MatDialogModule
	],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	providers: [OnlineAuthenticationSIOPService, HomeService, MatDialog],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

	actions: BodyAction[] = HOME_ACTIONS;
	optionsCustomRequest: MenuOption[] = [];
	optionsPIDAuthentication: MenuOption[] = [];
	optionsMDLAuthentication: MenuOption[] = [];
	optionsAgeVerification: MenuOption[] = [];

	private dialog: MatDialog = inject(MatDialog);

	constructor (
    private navigateService: NavigateService,
    private readonly onlineAuthenticationSIOPService: OnlineAuthenticationSIOPService,
    private readonly dataService: DataService,
    private readonly attestationSelectableModelService: AttestationSelectableModelService,
    private readonly homeService: HomeService,
    private readonly localStorageService: LocalStorageService,
	) {
		this.localStorageService.remove(constants.UI_PRESENTATION);
	}

	ngOnInit (): void {
		this.optionsCustomRequest = this.homeService.optionsCustomRequest;
		this.optionsPIDAuthentication = this.homeService.optionsPIDAuthentication;
		this.optionsMDLAuthentication = this.homeService.optionsMDLAuthentication;
		this.optionsAgeVerification = this.homeService.optionsAgeVerification;
	}

	private navTarget = '';

	setNavigateTarget (choose: string) {
		if (choose === 'PID_full') {
			this.navTarget = 'pid-full';
		} else if (choose === 'PID_Selectable') {
			this.navTarget = 'cbor-selectable/pid-create';
		} else if (choose === 'AgeOver18_attestation') {
			this.navTarget = 'age-attestation';
		} else if (choose === 'AgeOver18_pid') {
			this.navTarget = 'pid-age-over-18';
		} else if (choose === 'MDL_Selectable') {
			this.navTarget = 'cbor-selectable/mdl-create';
		} else if (choose === 'MDL_Full') {
			this.navTarget = 'mdl-full';
		} else if (choose === 'PD_Custom_Request') {
			this.navTarget = 'custom-request';
		}
		this.actions = [...this.actions].map((item) => {
			item.disabled = false;
			return item;
		});
	}

	submit () {
		if (this.navTarget === 'pid-full') {
			const presentationPurpose = 'We need to verify your identity';
			this.onlineAuthenticationSIOPService.initPIDPresentationTransaction(presentationPurpose).subscribe((data) => {
				this.dataService.setQRCode(data);
				this.navigateService.navigateTo(this.navTarget);
			});

		} else if (this.navTarget === 'cbor-selectable/pid-create') {
			const presentationPurpose = 'We need to verify your identity';
			this.attestationSelectableModelService.setPresentationPurpose(presentationPurpose);
			this.attestationSelectableModelService.setModel('PID');
			this.navigateService.navigateTo('cbor-selectable/create');

		} else if (this.navTarget === 'mdl-full') {
			const presentationPurpose = 'We need to verify your mobile driving licence';
			this.onlineAuthenticationSIOPService.initMDLPresentationTransaction(presentationPurpose).subscribe((data) => {
				this.dataService.setQRCode(data);
				this.navigateService.navigateTo(this.navTarget);
			});

		} else if (this.navTarget === 'cbor-selectable/mdl-create') {
			const presentationPurpose = 'We need to verify your mobile driving licence';
			this.attestationSelectableModelService.setPresentationPurpose(presentationPurpose);
			this.attestationSelectableModelService.setModel('MDL');
			this.navigateService.navigateTo('cbor-selectable/create');

		} else if (this.navTarget === 'pid-age-over-18') {
			const presentationPurpose = 'We need to verify you are over 18 using your PID';
			this.onlineAuthenticationSIOPService.initPIDAgeOver18PresentationTransaction(presentationPurpose).subscribe((data) => {
				this.dataService.setQRCode(data);
				this.navigateService.navigateTo(this.navTarget);
			});

		} else if (this.navTarget === 'age-attestation') {
			this.onlineAuthenticationSIOPService.initAgeOver18AttestationPresentationTransaction().subscribe((data) => {
				this.dataService.setQRCode(data);
				this.navigateService.navigateTo(this.navTarget);
			});

		} else if (this.navTarget === 'custom-request') {
			this.navigateService.navigateTo(this.navTarget);
		}
	}

	selectedIndexChange (_event: number) {
		this.actions = [...this.actions].map((item) => {
			item.disabled = true;
			return item;
		});
	}
}
