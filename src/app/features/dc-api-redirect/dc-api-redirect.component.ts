import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import jwtDecode from 'jwt-decode';
import { VerifierEndpointService } from '@core/services/verifier-endpoint.service';
import { LocalStorageService } from '@core/services/local-storage.service';
import { WalletLayoutComponent } from '@core/layout/wallet-layout/wallet-layout.component';
import { ActiveTransaction } from '@core/models/ActiveTransaction';
import { DcApiTransaction } from '@core/models/InitializedTransaction';
import { DCApiTransactionInitializationRequest } from '@core/models/TransactionInitializationRequest';
import * as constants from '@core/constants/general';
import { timeout } from 'rxjs/operators';

const DC_API_RETRIEVE_TIMEOUT_MS = 30000;

type DcApiRequestClaims = Pick<DCApiTransactionInitializationRequest, 'nonce' | 'dcql_query' | 'origin'>;

/**
 * URL-only entry point that initializes the DC API flow for a transaction id
 * received from the URL. It retrieves the (already initialized) DC API
 * request from the backend, decodes the sd-jwt to recover the fields the
 * existing DC API flow relies on, and stores the result as the active
 * transaction. The user starts the existing invoke-wallet flow explicitly.
 */
@Component({
	selector: 'vc-dc-api-redirect',
	standalone: true,
	imports: [CommonModule, MatButtonModule, WalletLayoutComponent],
	templateUrl: './dc-api-redirect.component.html',
	styleUrls: ['./dc-api-redirect.component.scss'],
	providers: [VerifierEndpointService],
})
export class DcApiRedirectComponent implements OnInit {
	private readonly localStorageService!: LocalStorageService;
	isReady = false;
	isInvalidTransaction = false;
	isTimedOut = false;

	constructor (
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly verifierEndpointService: VerifierEndpointService,
    private readonly injector: Injector,
    private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		this.localStorageService = this.injector.get(LocalStorageService);
	}

	ngOnInit (): void {
		const transactionId: string = this.route.snapshot.params['transactionId'];

		if (!transactionId) {
			this.isInvalidTransaction = true;
			return;
		}

		this.verifierEndpointService
			.getDcApiRetrieve(transactionId)
			.pipe(timeout(DC_API_RETRIEVE_TIMEOUT_MS))
			.subscribe({
				next: (dcApiTransaction: DcApiTransaction) => {
					this.isReady = true;
					this.isInvalidTransaction = false;
					this.isTimedOut = false;
					this.changeDetectorRef.detectChanges();

					try {
						this.storeActiveTransaction(dcApiTransaction);
					} catch (err) {
						console.error(err);
						this.isReady = false;
						this.isInvalidTransaction = true;
						this.changeDetectorRef.detectChanges();
					}
				},
				error: (err) => {
					console.error(err);
					this.isTimedOut = err?.name === 'TimeoutError';
					this.isInvalidTransaction = !this.isTimedOut;
					this.changeDetectorRef.detectChanges();
				},
			});
	}

	navigateToInvokeWallet (): void {
		this.router.navigate(['invoke-wallet']);
	}

	private storeActiveTransaction (dcApiTransaction: DcApiTransaction): void {
		const claims = jwtDecode(dcApiTransaction.request) as DcApiRequestClaims;

		const activeTransaction: ActiveTransaction = {
			initialized_transaction: dcApiTransaction,
			initialization_request: {
				nonce: claims.nonce,
				dcql_query: claims.dcql_query,
				origin: claims.origin,
			},
		};

		this.localStorageService.set(
			constants.ACTIVE_TRANSACTION,
			JSON.stringify(activeTransaction),
		);
	}
}
