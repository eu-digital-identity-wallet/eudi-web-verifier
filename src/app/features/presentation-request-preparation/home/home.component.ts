import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigateService } from '@app/core/services/navigate.service';
import { HOME_ACTIONS } from '@core/constants/pages-actions';
import { BodyAction } from '@app/shared/elements/body-actions/models/BodyAction';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '@shared/shared.module';
import { WalletLayoutComponent } from '@core/layout/wallet-layout/wallet-layout.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SupportedAttestationsComponent } from '@features/presentation-request-preparation/components/supported-attestations/supported-attestations.component';
import { MatStepperModule } from '@angular/material/stepper';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AttestationSelection, AttributeSelectionMethod } from '@features/presentation-request-preparation/models/AttestationSelection';
import { AttributeSelectionComponent } from '@features/presentation-request-preparation/components/attribute-selection/attribute-selection.component';
import { TransactionInitializationRequest } from '@core/models/TransactionInitializationRequest';
import { VerifierEndpointService } from '@core/services/verifier-endpoint.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AttributesSelectionEvent } from '../models/AttributesSelection';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { DCQLService } from '@app/core/services/dcql-service';
import { fallbackClientMetadata, MsoMdocVpFormat, SdJwtVcVpFormat } from '@app/core/models/ClientMetadata';
import { Subject, takeUntil } from 'rxjs';
import { SessionStorageService } from '@app/core/services/session-storage.service';
import { ISSUER_CHAIN } from '@app/core/constants/general';

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
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private readonly navigateService: NavigateService,
    private readonly verifierEndpointService: VerifierEndpointService,
    private readonly presentationDefinitionService: PresentationDefinitionService,
    private readonly dcqlService: DCQLService,
    private readonly sessionStorageService: SessionStorageService,
  ) {}

  actions: BodyAction[] = HOME_ACTIONS;

  queryTypeControl = new FormControl('prex');
  requestUriMethodControl = new FormControl('get');


  private readonly _formBuilder = inject(FormBuilder);
  formGroup = this._formBuilder.group({
    selectAttestationCtrl: ['', Validators.required],
  });

  selectedAttestations: AttestationSelection[] | null = null;
  selectedAttributes: { [id: string]: string[] } | null = null;
  selectedPresentationType: 'dcql' | 'prex' = 'prex';
  selectedRequestUriMethod: 'get' | 'post' = 'get';

  initializationRequest: TransactionInitializationRequest | null = null;

  private readonly destroy$ = new Subject<void>();
  vpFormatsPerType: { [key: string]: SdJwtVcVpFormat | MsoMdocVpFormat } = {};

  ngOnInit(): void {
    this.verifierEndpointService.getClientMetadata()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientMetadata) => {
          this.vpFormatsPerType = clientMetadata.vp_formats;
        },
        error: (err) => {
          console.error('Error fetching client metadata from backend. Using fallback client metadata', err);
          this.vpFormatsPerType = fallbackClientMetadata.vp_formats;
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSelectionChangedEvent($event: AttestationSelection[]) {
    this.selectedAttestations = $event;
  }

  handleAttributesCollectedEvent($event: AttributesSelectionEvent) {
    if ($event?.selectedAttributes) {
      this.selectedAttributes = $event.selectedAttributes;

      this.initializationRequest = this.prepareInitializationRequest(
        this.selectedPresentationType,
        this.selectedAttestations!,
        this.selectedAttributes,
        this.selectedRequestUriMethod
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
        this.selectedAttestations,
        this.selectedAttributes,
        this.selectedRequestUriMethod
      );
    } else {
      this.initializationRequest = null;
    }
  }
  
  handleRequestUriMethodChangedEvent($event: string) {
    this.selectedRequestUriMethod = $event as 'get' | 'post';
    
    if (this.selectedAttestations && this.selectedAttributes) {
      this.initializationRequest = this.prepareInitializationRequest(
        this.selectedPresentationType,
        this.selectedAttestations,
        this.selectedAttributes,
        this.selectedRequestUriMethod
      );
    } else {
      this.initializationRequest = null;
    }
  }

  private prepareInitializationRequest(
    presentationQueryType: 'dcql' | 'prex',
    selectedAttestations: AttestationSelection[],
    selectedAttributes: { [id: string]: string[] },
    selectedRequestUriMethod: 'get' | 'post'
  ): TransactionInitializationRequest {

    const issuerChain = this.sessionStorageService.get(ISSUER_CHAIN) ?? undefined;

    if (presentationQueryType === 'dcql') {
      return this.dcqlService.dcqlPresentationRequest(
        selectedAttestations, 
        selectedAttributes, 
        selectedRequestUriMethod, 
        issuerChain);
    } else {
      return this.presentationDefinitionService.presentationDefinitionRequest(
        selectedAttestations, 
        selectedAttributes, 
        this.vpFormatsPerType, 
        selectedRequestUriMethod,
        issuerChain
      );
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

  attestationsSelected(): boolean {
    return this.selectedAttestations !== null
      && this.selectedAttestations
      .filter((attestation) => 
        attestation.format !== null && attestation.attributeSelectionMethod !== null
      ).
      length > 0;
  }

  attributesSelected(): boolean {
    return this.selectedAttestations !== null 
    && this.selectedAttestations.filter((attestation) => {
      if(attestation.attributeSelectionMethod === AttributeSelectionMethod.SELECTABLE) {
        return this.selectedAttributes?.[attestation.type]?.length?? 0 > 0;
      } else if(attestation.attributeSelectionMethod === AttributeSelectionMethod.ALL_ATTRIBUTES) {
        return true;
      } else {
        return false;
      }
    }).length === this.selectedAttestations.length;
  }

  canProceed() {
    return this.initializationRequest !== null;
  }
}
