import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataService} from '@app/core/services/data.service';
import {NavigateService} from '@app/core/services/navigate.service';
import {VerifierEndpointService} from '@core/services/verifier-endpoint.service';
import {RadioGroupComponent} from '@app/shared/elements/radio-group/radio-group.component';
import {SharedModule} from '@app/shared/shared.module';
import {HomeService} from '../../services/home.service';
import {MenuOption} from '../../models/menu-option';
import {WalletLayoutComponent} from '@app/core/layout/wallet-layout/wallet-layout.component';
import {BodyAction} from '@app/shared/elements/body-actions/models/BodyAction';
import {HOME_ACTIONS} from '@core/constants/pages-actions';
import {LocalStorageService} from '@app/core/services/local-storage.service';
import * as constants from '@core/constants/constants';
import {InputSchemeComponent} from '../input-scheme/input-scheme.component';
import {MatTabsModule} from '@angular/material/tabs';
import {AttestationSelectableModelService} from '@app/core/services/attestation-selectable-model.service';
import {OpenLogsComponent} from '@app/shared/elements/open-logs/open-logs.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MsoMdocPresentationService} from "@core/services/mso-mdoc-presentation.service";

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
  providers: [VerifierEndpointService, HomeService, MatDialog],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  actions: BodyAction[] = HOME_ACTIONS;
  optionsCustomRequest: MenuOption[] = [];
  optionsPIDAuthentication: MenuOption[] = [];
  optionsMDLAuthentication: MenuOption[] = [];
  optionsAgeVerification: MenuOption[] = [];

  private dialog: MatDialog = inject(MatDialog);

  constructor(
    private navigateService: NavigateService,
    private readonly verifierEndpointService: VerifierEndpointService,
    private readonly dataService: DataService,
    private readonly attestationSelectableModelService: AttestationSelectableModelService,
    private readonly homeService: HomeService,
    private readonly localStorageService: LocalStorageService,
    private readonly msoMdocPresentationService: MsoMdocPresentationService
  ) {
    this.localStorageService.remove(constants.ACTIVE_TRANSACTION);
  }

  ngOnInit(): void {
    this.optionsCustomRequest = this.homeService.optionsCustomRequest;
    this.optionsPIDAuthentication = this.homeService.optionsPIDAuthentication;
    this.optionsMDLAuthentication = this.homeService.optionsMDLAuthentication;
    this.optionsAgeVerification = this.homeService.optionsAgeVerification;
  }

  private navTarget = '';

  setNavigateTarget(choose: string) {
    if (choose === 'PID_full') {
      this.navTarget = 'pid-full';
    } else if (choose === 'PID_Selectable') {
      this.navTarget = 'selectable/pid-create';
    } else if (choose === 'AgeOver18_attestation') {
      this.navTarget = 'age-attestation';
    } else if (choose === 'AgeOver18_pid') {
      this.navTarget = 'pid-age-over-18';
    } else if (choose === 'MDL_Selectable') {
      this.navTarget = 'selectable/mdl-create';
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

  submit() {
    if (this.navTarget === 'pid-full') {
      let presentationRequest = this.msoMdocPresentationService.presentationOfFullPid();
      this.verifierEndpointService.initializeTransaction(presentationRequest, (data) => {
        this.navigateService.navigateTo('invoke-wallet');
      });

    } else if (this.navTarget === 'selectable/pid-create') {
      this.prepareDataForSelectableView('PID', 'We need to verify your identity')
      this.navigateService.navigateTo('selectable/create');

    } else if (this.navTarget === 'mdl-full') {
      let presentationRequest = this.msoMdocPresentationService.presentationOfFullMdl();
      this.verifierEndpointService.initializeTransaction(presentationRequest, (data) => {
        this.navigateService.navigateTo('invoke-wallet');
      });

    } else if (this.navTarget === 'selectable/mdl-create') {
      this.prepareDataForSelectableView('MDL', 'We need to verify your mobile driving licence')
      this.navigateService.navigateTo('selectable/create');

    } else if (this.navTarget === 'pid-age-over-18') {
      let presentationRequest = this.msoMdocPresentationService.presentationOfPidOver18();
      this.verifierEndpointService.initializeTransaction(presentationRequest, (data) => {
        this.navigateService.navigateTo('invoke-wallet');
      });

    } else if (this.navTarget === 'age-attestation') {
      let presentationRequest = this.msoMdocPresentationService.presentationOfAgeAttestationOver18();
      this.verifierEndpointService.initializeTransaction(presentationRequest, (data) => {
        this.navigateService.navigateTo('invoke-wallet');
      });

    } else if (this.navTarget === 'custom-request') {
      this.navigateService.navigateTo('/custom-request');
    }
  }

  prepareDataForSelectableView(selectableModel: string, presentationPurpose: string) {
    this.attestationSelectableModelService.setPresentationPurpose(presentationPurpose);
    this.attestationSelectableModelService.setModel(selectableModel);
  }

  selectedIndexChange(_event: number) {
    this.actions = [...this.actions].map((item) => {
      item.disabled = true;
      return item;
    });
  }
}
