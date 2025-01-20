import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { PresentationsResultsComponent } from '@features/invoke-wallet/components/presentations-results/presentations-results.component';
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {JWTService} from "@core/services/jwt.service";
import {ViewAttestationComponent} from "@features/invoke-wallet/components/view-attestation/view-attestation.component";
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {DecodersRegistryService} from "@core/services/decoders-registry.service";
import {MsoMdocAttestationDecoder} from "@core/services/decoders/MsoMdocAttestationDecoder";
import {JwtVcJsonAttestationDecoder} from "@core/services/decoders/JwtVcJsonAttestationDecoder";
import {SdJwtVcAttestationDecoder} from "@core/services/decoders/SdJwtVcAttestationDecoder";

@Component({
	selector: 'vc-wallet-redirect',
	standalone: true,
	imports: [
    CommonModule,
    WalletLayoutComponent,
    PresentationsResultsComponent,
    ViewAttestationComponent
  ],
  providers: [
    VerifierEndpointService,
    DecodersRegistryService,
    MsoMdocAttestationDecoder,
    JwtVcJsonAttestationDecoder,
    SdJwtVcAttestationDecoder,
    JWTService
  ],
	templateUrl: './wallet-redirect.component.html',
	styleUrls: ['./wallet-redirect.component.scss']
})
export class WalletRedirectComponent implements OnInit {

  concludedTransaction!: ConcludedTransaction;

  constructor (private readonly activeRoute: ActivatedRoute) {}

	ngOnInit (): void {
		this.concludedTransaction = this.activeRoute.snapshot.data['data'];
	}

}
