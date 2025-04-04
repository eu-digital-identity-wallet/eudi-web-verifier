import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { PresentationsResultsComponent } from "@features/invoke-wallet/components/presentations-results/presentations-results.component";
import { JWTService } from "@core/services/jwt.service";
import { QrCodeComponent } from "@features/invoke-wallet/components/qr-code/qr-code.component";
import { VerifierEndpointService } from "@core/services/verifier-endpoint.service";
import { ConcludedTransaction } from "@core/models/ConcludedTransaction";
import { DecodersRegistryService } from "@core/services/decoders-registry.service";
import { MsoMdocAttestationDecoder } from "@core/services/decoders/MsoMdocAttestationDecoder";
import { JwtVcJsonAttestationDecoder } from "@core/services/decoders/JwtVcJsonAttestationDecoder";
import { ActivatedRoute } from "@angular/router";
import { RequestType } from "@app/core/constants/wallet-data";

@Component({
  selector: 'vc-wallet-invoker',
  standalone: true,
  imports: [CommonModule, SharedModule, PresentationsResultsComponent, QrCodeComponent],
  templateUrl: './invoker.component.html',
  providers: [VerifierEndpointService, DecodersRegistryService, MsoMdocAttestationDecoder, JwtVcJsonAttestationDecoder, JWTService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvokerComponent {
  constructor(private readonly route: ActivatedRoute) {
    this.requestType = this.route.snapshot.params['requestType'];
  }

  hasResult = false;

  response!: ConcludedTransaction;
  requestType: RequestType | null = null;

  handleTransactionConcludedEvent($event: ConcludedTransaction) {
    this.response = $event;
    this.hasResult = true;
  }

}
