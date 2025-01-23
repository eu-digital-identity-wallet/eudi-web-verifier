import {Component, inject} from '@angular/core';
import {NavigateService} from '@app/core/services/navigate.service';
import {HOME_ACTIONS} from '@core/constants/pages-actions';
import {BodyAction} from '@app/shared/elements/body-actions/models/BodyAction';
import {CommonModule} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {SharedModule} from "@shared/shared.module";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {MatDialogModule} from "@angular/material/dialog";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {
  SupportedAttestationsComponent
} from "@features/presentation-request-preparation/components/supported-attestations/supported-attestations.component";
import {MatStepperModule} from "@angular/material/stepper";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CredentialQuery} from "@core/models/dcql/DCQL";
import { AttributesSelectionEvent } from '../models/AttributesSelection';

@Component({
  standalone: true,
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
    MatButtonToggleModule
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

  queryTypeControl = new FormControl('dcql'); // TODO validate

  private _formBuilder = inject(FormBuilder);
  formGroup = this._formBuilder.group({
    selectAttestationCtrl: ['', Validators.required]
  });

  attestationsSelection: AttestationSelection[] | null = null;
  
  inputDescriptors: InputDescriptor[] | null = null;
  dcqlQueries: CredentialQuery[] | null = null;

  initializationRequest: TransactionInitializationRequest | null = null;

  handleSelectionChangedEvent($event: AttestationSelection[]) {
    this.attestationsSelection = $event;
  }

  handleAttributesCollectedEvent($event: AttributesSelectionEvent) {
    if ($event != null && $event.inputDescriptors.length > 0) {
      this.inputDescriptors = $event.inputDescriptors;
      this.dcqlQueries = $event.dcqlQueries;
    } else {
      this.inputDescriptors = null;
      this.dcqlQueries = null;
    }
    this.initializationRequest = this.prepareInitializationRequest();
  }

  handleQueryTypeChangedEvent($event: string) {
    console.log(`presentationQueryType: ${$event}`)
    if(this.inputDescriptors != null && this.inputDescriptors.length > 0) {
      this.initializationRequest = this.prepareInitializationRequest();
    } else {
      this.initializationRequest = null
    }
  }

  prepareInitializationRequest(): TransactionInitializationRequest {
    console.log(`presentationQueryType: ${this.queryTypeControl.value}`)
    if(this.queryTypeControl.value === 'dcql') {
      return {
        type: "vp_token",
        dcql_query: {
          credentials: this.dcqlQueries!.map((q, index) => {
            q.id = `query_${index}`
            return q
          }),
        },
        nonce: uuidv4()
      }
    } else {
      return {
        type: "vp_token",
        presentation_definition: {
          id: uuidv4(),
          input_descriptors: this.inputDescriptors!
        },
        nonce: uuidv4()
      }
    }
  }

  proceedToInvokeWallet() {
    console.log(`presentationQueryType: ${this.queryTypeControl.value}`)
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
