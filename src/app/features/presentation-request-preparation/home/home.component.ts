import {Component, inject, OnDestroy} from '@angular/core';
import {NavigateService} from '@app/core/services/navigate.service';
import {HOME_ACTIONS} from '@core/constants/pages-actions';
import {BodyAction} from '@app/shared/elements/body-actions/models/BodyAction';
import {CommonModule} from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {SharedModule} from '@shared/shared.module';
import {WalletLayoutComponent} from '@core/layout/wallet-layout/wallet-layout.component';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {
  SupportedAttestationsComponent
} from '@features/presentation-request-preparation/components/supported-attestations/supported-attestations.component';
import {MatStepperModule} from '@angular/material/stepper';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {AttestationSelection, AttributeSelectionMethod,} from '@features/presentation-request-preparation/models/AttestationSelection';
import {
  AttributeSelectionComponent
} from '@features/presentation-request-preparation/components/attribute-selection/attribute-selection.component';
import {DCApiPresentationOptions, DCApiTransactionInitializationRequest, DefaultDCApiPresentationOptions, DefaultRedirectsPresentationOptions, Profile, profileOptions, RedirectsPresentationOptions, RedirectsTransactionInitializationRequest, RequestUriMethod, TransactionInitializationRequest,} from '@core/models/TransactionInitializationRequest';
import {VerifierEndpointService} from '@core/services/verifier-endpoint.service';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AttributesSelectionEvent} from '../models/AttributesSelection';
import {DCQLService} from '@app/core/services/dcql-service';
import {Subject} from 'rxjs';
import {SessionStorageService} from '@app/core/services/session-storage.service';
import {DefaultProfile, DefaultRequestUriMethod, ISSUER_CHAIN,} from '@app/core/constants/general';
import {SUPPORTED_ATTESTATIONS} from '@app/core/constants/attestation-definitions';
import {PresentationOptionsRedirectsComponent, RedirectsPresentationOptionsChangedEvent} from '../components/presentation-options-redirects/presentation-options-redirects.component';
import {DcApiPresentationOptionsChangedEvent, PresentationOptionsDcApiComponent} from '../components/presentation-options-dc-api/presentation-options-dc-api.component';
import {PresentationOptionsRegistrationCertificateComponent, RegistrationCertificatePresentationOptionsChangedEvent} from '../components/presentation-options-registration-certificate/presentation-options-registration-certificate.component';
import {LocalStorageService} from "@core/services/local-storage.service";
import { v4 as uuidv4 } from 'uuid';
import { isDCApiSupported } from '@app/shared/utils/dc-api-utils';

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
    PresentationOptionsRedirectsComponent,
    PresentationOptionsDcApiComponent,
    PresentationOptionsRegistrationCertificateComponent,
  ],
  providers: [VerifierEndpointService, LocalStorageService],
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
    private readonly localStorageService: LocalStorageService
  ) {
  }
  readonly dcApiSupported = isDCApiSupported();

  actions: BodyAction[] = HOME_ACTIONS;

  requestUriMethodControl = new FormControl<RequestUriMethod>(DefaultRequestUriMethod, {
    nonNullable: true,
  });
  authorizationSchemeControl = new FormControl<string>(
    profileOptions[DefaultProfile].endpoint,
    {nonNullable: true}
  );
  presentationProfileControl = new FormControl<Profile>(DefaultProfile, {
    nonNullable: true,
  });

  private readonly _formBuilder = inject(FormBuilder);
  formGroup = this._formBuilder.group({
    selectAttestationCtrl: ['', Validators.required],
  });

  selectedAttestations: AttestationSelection[] | null = null;
  selectedAttributes: { [id: string]: string[] } | null = {};
  selectedRequestUriMethod: RequestUriMethod = DefaultRequestUriMethod;
  redirectsOptions: RedirectsPresentationOptions = DefaultRedirectsPresentationOptions;
  dcApiOptions: DCApiPresentationOptions = DefaultDCApiPresentationOptions;
  commonOptions: RegistrationCertificatePresentationOptionsChangedEvent = {};

  initializationRequest: TransactionInitializationRequest | null = null;
  requestMode: 'redirects' | 'dc-api' = 'redirects';

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSelectionChangedEvent($event: AttestationSelection[]) {
    this.selectedAttestations = $event;

    if (this.selectedAttestations) {
      this.selectedAttestations.forEach((attestation) => {
        const attestationDef = SUPPORTED_ATTESTATIONS[attestation.type];
        if (attestationDef) {
          const neverSelectivelyDisclosableAttributes = attestationDef.dataSet
            .filter(
              (dataElement) => dataElement.selectivelyDisclosable === 'never'
            )
            .map((dataElement) => dataElement.identifier);
          if (neverSelectivelyDisclosableAttributes.length > 0) {
            this.selectedAttributes![attestation.type] =
              neverSelectivelyDisclosableAttributes;
          }
        }
      });
    }
  }

  handleAttributesCollectedEvent($event: AttributesSelectionEvent) {
    if ($event?.selectedAttributes) {
      this.selectedAttributes = $event.selectedAttributes;

      this.initializationRequest = this.prepareRedirectsInitializationRequest(
        this.selectedAttestations!,
        this.selectedAttributes,
        this.redirectsOptions
      );
    } else {
      this.selectedAttributes = null;
    }
  }

  handleRequestModeChange($event: any) {
    if ($event?.index === 0) {
      this.requestMode = 'redirects';
      if (this.selectedAttestations && this.selectedAttributes) {
        this.initializationRequest = this.prepareRedirectsInitializationRequest(
          this.selectedAttestations,
          this.selectedAttributes,
          this.redirectsOptions
        );
      } else {
        this.initializationRequest = null;
      }
    } else {
      this.requestMode = 'dc-api';
      if (this.selectedAttestations && this.selectedAttributes) {
        this.initializationRequest = this.prepareDcApiInitializationRequest(
          this.selectedAttestations,
          this.selectedAttributes,
          this.dcApiOptions
        );
      } else {
        this.initializationRequest = null;
      }
    }
  }

  handleRedirectsPresentationOptionsChangedEvent($event: RedirectsPresentationOptionsChangedEvent) {
    this.redirectsOptions = $event.options;
    if (this.selectedAttestations && this.selectedAttributes) {
      this.initializationRequest = this.prepareRedirectsInitializationRequest(
        this.selectedAttestations,
        this.selectedAttributes,
        this.redirectsOptions
      );
    } else {
      this.initializationRequest = null;
    }
  }
  
  handleDcApiPresentationOptionsChangedEvent($event: DcApiPresentationOptionsChangedEvent) {
    this.dcApiOptions = $event.options;
    if (this.selectedAttestations && this.selectedAttributes) {
      this.initializationRequest = this.prepareDcApiInitializationRequest(
        this.selectedAttestations,
        this.selectedAttributes,
        this.dcApiOptions
      );
    } else {
      this.initializationRequest = null;
    }
  }

  handleRegistrationCertificateOptionsChangedEvent($event: RegistrationCertificatePresentationOptionsChangedEvent) {
    this.commonOptions = $event;
    if (this.selectedAttestations && this.selectedAttributes) {
      if (this.requestMode === 'redirects') {
        this.initializationRequest = this.prepareRedirectsInitializationRequest(
          this.selectedAttestations,
          this.selectedAttributes,
          this.redirectsOptions
        );
      } else {
        this.initializationRequest = this.prepareDcApiInitializationRequest(
          this.selectedAttestations,
          this.selectedAttributes,
          this.dcApiOptions
        );
      }
    }
  }

  private prepareRedirectsInitializationRequest(
    selectedAttestations: AttestationSelection[],
    selectedAttributes: { [id: string]: string[] },
    options: RedirectsPresentationOptions,
  ): RedirectsTransactionInitializationRequest {
    const issuerChain =
      this.sessionStorageService.get(ISSUER_CHAIN) ?? undefined;

    return {
      dcql_query: {
        credentials: this.dcqlService.getDCQLCredentialQueries(
          selectedAttestations,
          selectedAttributes
        ),
      },
      nonce: uuidv4(),
      request_uri_method: options.requestUriMethod,
      issuer_chain: issuerChain,
      profile: options.profile,
      authorization_request_uri: options.authorizationRequestUri,
      ...(this.commonOptions.registrationCertificate ? { registration_certificate: this.commonOptions.registrationCertificate } : {}),
      ...(this.commonOptions.intendedUseId ? { intended_use_id: this.commonOptions.intendedUseId } : {}),
    };
  }

  private prepareDcApiInitializationRequest(
    selectedAttestations: AttestationSelection[],
    selectedAttributes: { [id: string]: string[] },
    options: DCApiPresentationOptions
  ): DCApiTransactionInitializationRequest {
    const issuerChain =
      this.sessionStorageService.get(ISSUER_CHAIN) ?? undefined;

    return {
      dcql_query: {
        credentials: this.dcqlService.getDCQLCredentialQueries(
          selectedAttestations,
          selectedAttributes
        ),
      },
      nonce: uuidv4(),
      issuer_chain: issuerChain,
      origin: window.location.origin,
      ...(options.expected_origins?.length
        ? { expected_origins: options.expected_origins }
        : {}),
      ...(this.commonOptions.registrationCertificate ? { registration_certificate: this.commonOptions.registrationCertificate } : {}),
      ...(this.commonOptions.intendedUseId ? { intended_use_id: this.commonOptions.intendedUseId } : {}),
    };
  }

  proceedToInvokeWalletOverRedirects() {
    if (this.initializationRequest != null) {
      this.verifierEndpointService.initializeRedirectsTransaction(
        this.initializationRequest as RedirectsTransactionInitializationRequest,
        (_) => {
          this.navigateService.navigateTo('invoke-wallet');
        }
      );
    } else {
      alert('nothing to submit');
    }
  }

  proceedToInvokeWalletOverDcApi() {
    if (this.initializationRequest != null) {
      this.verifierEndpointService.initializeDcApiTransaction(
        this.initializationRequest as DCApiTransactionInitializationRequest,
        (_) => {
          this.navigateService.navigateTo('invoke-wallet');
        }
      );
    } else {
      alert('nothing to submit');
    }
  }

  attestationsSelected(): boolean {
    return (
      this.selectedAttestations !== null &&
      this.selectedAttestations.filter(
        (attestation) =>
          attestation.format !== null &&
          attestation.attributeSelectionMethod !== null
      ).length > 0
    );
  }

  attributesSelected(): boolean {
    return (
      this.selectedAttestations !== null &&
      this.selectedAttestations.filter((attestation) => {
        if (
          attestation.attributeSelectionMethod ===
          AttributeSelectionMethod.SELECTABLE
        ) {
          return this.selectedAttributes?.[attestation.type]?.length ?? 0 > 0;
        } else
          return (
            attestation.attributeSelectionMethod ===
            AttributeSelectionMethod.ALL_ATTRIBUTES
          );
      }).length === this.selectedAttestations.length
    );
  }

  canProceed() {
    return this.initializationRequest !== null;
  }

  proceedToInvokeWallet() {
    if (this.requestMode === 'redirects') {
      this.proceedToInvokeWalletOverRedirects();
    } else {
      this.proceedToInvokeWalletOverDcApi();
    }
  }

  canSubmit(): boolean {
    if (this.requestMode === 'dc-api') {
      return this.canProceed() && this.dcApiSupported;
    }
    return this.canProceed();
  }

}
