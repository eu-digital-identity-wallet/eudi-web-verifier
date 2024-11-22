import {Component, inject} from '@angular/core';
import {NavigateService} from '@app/core/services/navigate.service';
import {HOME_ACTIONS} from '@core/constants/pages-actions';
import {BodyAction} from '@app/shared/elements/body-actions/models/BodyAction';
import {CommonModule} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {RadioGroupComponent} from "@shared/elements/radio-group/radio-group.component";
import {SharedModule} from "@shared/shared.module";
import {InputSchemeComponent} from "@shared/elements/input-scheme/input-scheme.component";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {OpenLogsComponent} from "@shared/elements/open-logs/open-logs.component";
import {MatDialogModule} from "@angular/material/dialog";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {
  SupportedAttestationsComponent
} from "@features/presentation-request-preparation/components/supported-attestations/supported-attestations.component";
import {MatStepperModule} from "@angular/material/stepper";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {AttestationSelection} from "@features/presentation-request-preparation/models/AttestationSelection";
import {
  AttributeSelectionComponent
} from "@features/presentation-request-preparation/components/attribute-selection/attribute-selection.component";
import {TransactionInitializationRequest} from "@core/models/TransactionInitializationRequest";
import {InputDescriptor} from "@core/models/presentation/InputDescriptor";
import {v4 as uuidv4} from "uuid";
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {MatExpansionModule} from "@angular/material/expansion";
import {AttestationSelectionComponent} from "@features/presentation-request-preparation/components/attestation-selection/attestation-selection.component";

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
        MatDialogModule,
        RouterOutlet,
        SupportedAttestationsComponent,
        MatStepperModule,
        ReactiveFormsModule,
        MatButtonModule,
        AttributeSelectionComponent,
        MatExpansionModule,
        RouterLinkActive,
        RouterLink,
        AttestationSelectionComponent
    ],
  providers: [VerifierEndpointService],
  selector: 'vc-presentation-preparation-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private readonly navigateService: NavigateService,
    private readonly verifierEndpointService: VerifierEndpointService,
  ) { }

  actions: BodyAction[] = HOME_ACTIONS;

  private _formBuilder = inject(FormBuilder);
  formGroup = this._formBuilder.group({
    selectAttestationCtrl: ['', Validators.required]
  });

  attestationsSelection: AttestationSelection[] | null = null;
  initializationRequest: TransactionInitializationRequest | null = null;

  handleSelectionChangedEvent($event: AttestationSelection[]) {
    this.attestationsSelection = $event;
  }

  handleAttributesCollectedEvent($event: InputDescriptor[]) {
    if ($event != null && $event.length > 0) {
      this.initializationRequest = this.prepareInitializationRequest($event);
    } else
      this.initializationRequest = null
  }

  prepareInitializationRequest(inputDescriptors: InputDescriptor[]): TransactionInitializationRequest {
    return {
      type: "vp_token",
      presentation_definition: {
        id: uuidv4(),
        input_descriptors: inputDescriptors
      },
      nonce: uuidv4()
    }
  }

  proceedToInvokeWallet() {
    if (this.initializationRequest != null) {
      this.verifierEndpointService.initializeTransaction(this.initializationRequest, (_) => {
        this.navigateService.navigateTo('invoke-wallet');
      });
    } else {
      alert("nothing to submit")
    }
  }

  canProceed() {
    return this.initializationRequest !== null;
  }
}
