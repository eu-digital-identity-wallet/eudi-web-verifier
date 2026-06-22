import {ChangeDetectionStrategy, Component, Injector, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {PresentationsResultsComponent} from "@features/invoke-wallet/components/presentations-results/presentations-results.component";
import {JWTService} from "@core/services/jwt.service";
import {QrCodeComponent} from "@features/invoke-wallet/components/qr-code/qr-code.component";
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {DecodersRegistryService} from "@core/services/decoders-registry.service";
import {MsoMdocAttestationDecoder} from "@core/services/decoders/MsoMdocAttestationDecoder";
import {JwtVcJsonAttestationDecoder} from "@core/services/decoders/JwtVcJsonAttestationDecoder";
import {SdJwtVcAttestationDecoder} from "@core/services/decoders/SdJwtVcAttestationDecoder";
import {LocalStorageService} from "@core/services/local-storage.service";
import {ACTIVE_TRANSACTION} from "@core/constants/general";
import {ActiveTransaction} from "@core/models/ActiveTransaction";
import {DcApiComponent} from "@features/invoke-wallet/components/dc-api/dc-api.component";

@Component({
    selector: 'vc-wallet-invoker',
    imports: [CommonModule, SharedModule, PresentationsResultsComponent, QrCodeComponent, DcApiComponent],
    templateUrl: './invoker.component.html',
    providers: [VerifierEndpointService, DecodersRegistryService, MsoMdocAttestationDecoder, JwtVcJsonAttestationDecoder, SdJwtVcAttestationDecoder, JWTService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvokerComponent implements OnInit {

  private readonly localStorageService!: LocalStorageService;

  hasResult = false;
  isDcApiTransaction = false;
  response!: ConcludedTransaction;

  constructor(
    private readonly injector: Injector,
  ) {
    this.localStorageService = this.injector.get(LocalStorageService);
  }

  ngOnInit(): void {
    const activeTransaction: ActiveTransaction = JSON.parse(
      this.localStorageService.get(ACTIVE_TRANSACTION)!
    );
    this.isDcApiTransaction = !('authorization_request_uri' in activeTransaction.initialized_transaction );
  }

  handleTransactionConcludedEvent($event: ConcludedTransaction) {
    this.response = $event;
    this.hasResult = true;
  }

}
