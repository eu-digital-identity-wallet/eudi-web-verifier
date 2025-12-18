import { Component, inject, OnDestroy } from '@angular/core';
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
import { Profile, RequestUriMethod, TransactionInitializationRequest } from '@core/models/TransactionInitializationRequest';
import { VerifierEndpointService } from '@core/services/verifier-endpoint.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AttributesSelectionEvent } from '../models/AttributesSelection';
import { DCQLService } from '@app/core/services/dcql-service';
import { Subject } from 'rxjs';
import { SessionStorageService } from '@app/core/services/session-storage.service';
import { DEFAULT_SCHEME, ISSUER_CHAIN, SCHEME } from '@app/core/constants/general';
import { SUPPORTED_ATTESTATIONS } from '@app/core/constants/attestation-definitions';
import { PresentationOptionsComponent } from '../components/presentation-options/presentation-options.component';

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
    PresentationOptionsComponent
  ],
  providers: [VerifierEndpointService],
  selector: 'vc-presentation-preparation-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  constructor(
    private readonly navigateService: NavigateService,
    private readonly verifierEndpointService: VerifierEndpointService,
    private readonly dcqlService: DCQLService,
    private readonly sessionStorageService: SessionStorageService,
  ) {}

  actions: BodyAction[] = HOME_ACTIONS;

  requestUriMethodControl = new FormControl<RequestUriMethod>('get', {
    nonNullable: true,
  });
  authorizationSchemeControl = new FormControl<string>(
    this.getStoredAuthorizationScheme(),
    { nonNullable: true }
  );
  presentationProfileControl = new FormControl<Profile>(
    'openid4vp',
    { nonNullable: true }
  );


  private readonly _formBuilder = inject(FormBuilder);
  formGroup = this._formBuilder.group({
    selectAttestationCtrl: ['', Validators.required],
  });

  selectedAttestations: AttestationSelection[] | null = null;
  selectedAttributes: { [id: string]: string[] } | null = {};
  selectedRequestUriMethod: RequestUriMethod = 'get';
  selectedProfile: Profile = 'openid4vp';

  initializationRequest: TransactionInitializationRequest | null = null;

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSelectionChangedEvent($event: AttestationSelection[]) {
    this.selectedAttestations = $event;
    
    if (this.selectedAttestations) {
      this.selectedAttestations.forEach(attestation => {
        const attestationDef = SUPPORTED_ATTESTATIONS[attestation.type];
        if (attestationDef) {
          const neverSelectivelyDisclosableAttributes = attestationDef.dataSet
            .filter(dataElement => dataElement.selectivelyDisclosable === 'never')
            .map(dataElement => dataElement.identifier);
          if (neverSelectivelyDisclosableAttributes.length > 0) {
            this.selectedAttributes![attestation.type] = neverSelectivelyDisclosableAttributes;
          }
        }
      });
    }
    
  }

  handleAttributesCollectedEvent($event: AttributesSelectionEvent) {
    if ($event?.selectedAttributes) {
      this.selectedAttributes = $event.selectedAttributes;

      this.initializationRequest = this.prepareInitializationRequest(
        this.selectedAttestations!,
        this.selectedAttributes,
        this.selectedRequestUriMethod,
        this.selectedProfile
      );
    } else {
      this.selectedAttributes = null;
    }
  }

  handleRequestUriMethodChangedEvent($event: string) {
    this.selectedRequestUriMethod = $event as RequestUriMethod;

    if (this.selectedAttestations && this.selectedAttributes) {
      this.initializationRequest = this.prepareInitializationRequest(
        this.selectedAttestations,
        this.selectedAttributes,
        this.selectedRequestUriMethod,
        this.selectedProfile
      );
    } else {
      this.initializationRequest = null;
    }
  }

  handleProfileChangedEvent($event: string) {
    this.selectedProfile = $event as Profile;
    if (this.selectedAttestations && this.selectedAttributes) {
      this.initializationRequest = this.prepareInitializationRequest(
        this.selectedAttestations,
        this.selectedAttributes,
        this.selectedRequestUriMethod,
        this.selectedProfile
      );
    } else {
      this.initializationRequest = null;
    }
  }

  private prepareInitializationRequest(
    selectedAttestations: AttestationSelection[],
    selectedAttributes: { [id: string]: string[] },
    selectedRequestUriMethod: RequestUriMethod,
    selectedProfile: Profile
  ): TransactionInitializationRequest {

    const issuerChain = this.sessionStorageService.get(ISSUER_CHAIN) ?? undefined;

    return this.dcqlService.dcqlPresentationRequest(
      selectedAttestations,
      selectedAttributes,
      selectedRequestUriMethod,
      selectedProfile,
      issuerChain);
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
      } else return attestation.attributeSelectionMethod === AttributeSelectionMethod.ALL_ATTRIBUTES;
    }).length === this.selectedAttestations.length;
  }

  canProceed() {
    return this.initializationRequest !== null;
  }

  private getStoredAuthorizationScheme(): string {
    if (typeof window === 'undefined' || !window.localStorage) {
      return DEFAULT_SCHEME;
    }

    return window.localStorage.getItem(SCHEME) ?? DEFAULT_SCHEME;
  }
}
