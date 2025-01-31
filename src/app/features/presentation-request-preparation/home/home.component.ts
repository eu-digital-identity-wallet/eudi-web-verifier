import { Component, inject } from '@angular/core';
import { NavigateService } from '@app/core/services/navigate.service';
import { HOME_ACTIONS } from '@core/constants/pages-actions';
import { BodyAction } from '@app/shared/elements/body-actions/models/BodyAction';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '@shared/shared.module';
import { WalletLayoutComponent } from '@core/layout/wallet-layout/wallet-layout.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SupportedAttestationsComponent } from '@features/presentation-request-preparation/components/supported-attestations/supported-attestations.component';
import { MatStepperModule } from '@angular/material/stepper';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AttestationSelection } from '@features/presentation-request-preparation/models/AttestationSelection';
import { AttributeSelectionComponent } from '@features/presentation-request-preparation/components/attribute-selection/attribute-selection.component';
import { TransactionInitializationRequest } from '@core/models/TransactionInitializationRequest';
import { VerifierEndpointService } from '@core/services/verifier-endpoint.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AttributesSelectionEvent } from '../models/AttributesSelection';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition-service';
import { DCQLService } from '@app/core/services/dcql-service';

@Component({
  imports: [
    CommonModule,
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
    RouterLink,
    MatIconModule,
    ClipboardModule,
    MatTooltipModule,
    MatButtonToggleModule,
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
    private readonly presentationDefinitionService: PresentationDefinitionService,
    private readonly dcqlService: DCQLService
  ) {}

  actions: BodyAction[] = HOME_ACTIONS;

  queryTypeControl = new FormControl('prex');

  private _formBuilder = inject(FormBuilder);
  formGroup = this._formBuilder.group({
    selectAttestationCtrl: ['', Validators.required],
  });

  selectedAttestations: AttestationSelection[] | null = null;
  selectedAttributes: { [id: string]: string[] } | null = null;
  selectedPresentationType: 'dcql' | 'prex' = 'prex';

  initializationRequest: TransactionInitializationRequest | null = null;

  handleSelectionChangedEvent($event: AttestationSelection[]) {
    this.selectedAttestations = $event;
  }

  handleAttributesCollectedEvent($event: AttributesSelectionEvent) {
    if ($event != null && $event.selectedAttributes != null) {
      this.selectedAttributes = $event.selectedAttributes;

      this.initializationRequest = this.prepareInitializationRequest(
        this.selectedPresentationType,
        this.selectedAttestations!,
        this.selectedAttributes
      );
    } else {
      this.selectedAttributes = null;
    }
  }

  handleQueryTypeChangedEvent($event: string) {
    this.selectedPresentationType = $event as 'dcql' | 'prex';

    if (this.selectedAttestations && this.selectedAttributes) {
      this.initializationRequest = this.prepareInitializationRequest(
        this.selectedPresentationType,
        this.selectedAttestations!,
        this.selectedAttributes
      );
    } else {
      this.initializationRequest = null;
    }
  }

  private prepareInitializationRequest(
    presentationQueryType: 'dcql' | 'prex',
    selectedAttestations: AttestationSelection[],
    selectedAttributes: { [id: string]: string[] }
  ): TransactionInitializationRequest {
    if (presentationQueryType === 'dcql') {
      return this.dcqlService.dcqlPresentationRequest(selectedAttestations, selectedAttributes);
    } else {
      return this.presentationDefinitionService.presentationDefinitionRequest(selectedAttestations, selectedAttributes);
    }
  }

  proceedToInvokeWallet() {
    if (this.initializationRequest != null) {
      this.verifierEndpointService.initializeTransaction(
        this.initializationRequest,
        (_) => {
          this.navigateService.navigateTo('invoke-wallet');
        }
      );
    } else {
      alert('nothing to submit');
    }
  }

  canProceed() {
    return this.initializationRequest !== null;
  }
}
