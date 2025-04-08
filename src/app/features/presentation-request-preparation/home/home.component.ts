import {Component, inject, OnInit} from '@angular/core';
import {NavigateService} from '@app/core/services/navigate.service';
import {HOME_ACTIONS} from '@core/constants/pages-actions';
import {BodyAction} from '@app/shared/elements/body-actions/models/BodyAction';
import {CommonModule} from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {SharedModule} from '@shared/shared.module';
import {WalletLayoutComponent} from '@core/layout/wallet-layout/wallet-layout.component';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SupportedAttestationsComponent} from '@features/presentation-request-preparation/components/supported-attestations/supported-attestations.component';
import {MatStepperModule} from '@angular/material/stepper';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {AttestationSelection} from '@features/presentation-request-preparation/models/AttestationSelection';
import {AttributeSelectionComponent} from '@features/presentation-request-preparation/components/attribute-selection/attribute-selection.component';
import {TransactionInitializationRequest} from '@core/models/TransactionInitializationRequest';
import {InputDescriptor} from '@core/models/presentation/InputDescriptor';
import {v4 as uuidv4} from 'uuid';
import {VerifierEndpointService} from '@core/services/verifier-endpoint.service';
import {MatExpansionModule} from '@angular/material/expansion';
import {LocalStorageService} from "@core/services/local-storage.service";
import {REGISTRATION_DATA} from "@core/constants/general";

export interface RegistrationData {
  readerCountry?: string;
  readerCompanyName?: string;
  holderTesterInitials?: string;
  holderDevice?: string;
  dataset?: string;
  testScenario?: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    SharedModule,
    WalletLayoutComponent,
    MatDialogModule,
    SupportedAttestationsComponent,
    MatStepperModule,
    ReactiveFormsModule,
    MatButtonModule,
    AttributeSelectionComponent,
    MatExpansionModule,
    RouterLinkActive,
    RouterLink
  ],
  providers: [VerifierEndpointService],
  selector: 'vc-presentation-preparation-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly navigateService: NavigateService,
    private readonly verifierEndpointService: VerifierEndpointService,
    private readonly localStorageService: LocalStorageService,
  ) {
  }

  showStepper = false;
  actions: BodyAction[] = HOME_ACTIONS;

  readerCountry: string = "";
  readerCompanyName: string = "";
  holderTesterInitials: string = "";
  holderDevice: string = "";
  dataset: string = "";
  testScenario: string = "";

  private _formBuilder = inject(FormBuilder);
  formGroup = this._formBuilder.group({
    selectAttestationCtrl: ['', Validators.required]
  });

  attestationsSelection: AttestationSelection[] | null = null;
  initializationRequest: TransactionInitializationRequest | null = null;

  ngOnInit(): void {
    this.localStorageService.set(REGISTRATION_DATA, JSON.stringify(this.getRegistrationData()))
  }

  handleSelectionChangedEvent($event: AttestationSelection[]) {
    this.attestationsSelection = $event;
  }

  handleAttributesCollectedEvent($event: InputDescriptor[]) {
    if ($event != null && $event.length > 0) {
      this.initializationRequest = this.prepareInitializationRequest($event);
    } else
      this.initializationRequest = null;
  }

  prepareInitializationRequest(inputDescriptors: InputDescriptor[]): TransactionInitializationRequest {
    console.log("prepareInitializationRequest")
    return {
      type: 'vp_token',
      presentation_definition: {
        id: uuidv4(),
        input_descriptors: inputDescriptors
      },
      nonce: uuidv4(),
      registration_data: this.getRegistrationData(),
    };
  }

  proceedToInvokeWallet() {
    if (this.initializationRequest != null) {
      this.verifierEndpointService.initializeTransaction(
        this.initializationRequest, (_) => {
          this.navigateService.navigateTo('invoke-wallet');
        },
        this.getRegistrationData());
    } else {
      alert('nothing to submit');
    }
  }

  isRegistrationFormFilled() {
    return !!this.readerCountry && !!this.readerCountry.trim() &&
      !!this.readerCompanyName && !!this.readerCompanyName.trim() &&
      !!this.holderTesterInitials && !!this.holderTesterInitials.trim() &&
      !!this.holderDevice && !!this.holderDevice.trim() &&
      !!this.dataset && !!this.dataset.trim() &&
      !!this.testScenario && !!this.testScenario.trim();
  }

  getRegistrationData(): RegistrationData {
    return {
      readerCountry: this.readerCountry,
      readerCompanyName: this.readerCompanyName,
      holderTesterInitials: this.holderTesterInitials,
      holderDevice: this.holderDevice,
      dataset: this.dataset,
      testScenario: this.testScenario,
    }
  }

  isTestCaseActive(code: string): boolean {
    return this.isRegistrationFormFilled() && this.testScenario === code
  }

  canProceed() {
    return this.initializationRequest !== null && this.isRegistrationFormFilled();
  }

  syncLocalStorage() {
    let registrationData = JSON.parse(this.localStorageService.get(REGISTRATION_DATA)!!)
    registrationData.readerCountry = this.readerCountry
    registrationData.readerCompanyName = this.readerCompanyName
    registrationData.holderTesterInitials = this.holderTesterInitials
    registrationData.holderDevice = this.holderDevice
    registrationData.dataset = this.dataset
    registrationData.testScenario = this.testScenario
    this.localStorageService.set(REGISTRATION_DATA, JSON.stringify(registrationData))
  }
}
