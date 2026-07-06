import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from '@angular/core';
import { VerifierEndpointService } from '../../../../core/services/verifier-endpoint.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import * as constants from '@core/constants/general';
import { ACTIVE_TRANSACTION } from '@core/constants/general';
import { ActiveTransaction } from '@core/models/ActiveTransaction';
import { ConcludedTransaction } from '@core/models/ConcludedTransaction';
import { WalletResponse } from '@core/models/WalletResponse';
import { OpenLogsComponent } from '@shared/elements/open-logs/open-logs.component';
import { userAgentAllowsProtocol } from '@shared/utils/dc-api-utils';
import { OpenId4VPDigitalCredential } from './model/DigitalCredential';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '@shared/shared.module';
import { NavigateService } from '@core/services/navigate.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DcApiTransaction } from '@core/models/InitializedTransaction';
import { MatButtonModule } from '@angular/material/button';
import { concatMap } from 'rxjs';
import { DCApiTransactionInitializationRequest } from '@app/core/models/TransactionInitializationRequest';

@Component({
  selector: 'vc-dc-api',
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
  ],
  templateUrl: './dc-api.component.html',
  styleUrls: ['./dc-api.component.scss'],
  providers: [VerifierEndpointService],
})
export class DcApiComponent implements OnInit {
  private readonly localStorageService!: LocalStorageService;

  readonly dialog!: MatDialog;

  transaction!: ActiveTransaction;

  @Output() transactionConcludedEvent =
    new EventEmitter<ConcludedTransaction>();

  emitTransactionConcludedEvent(concludedTransaction: ConcludedTransaction) {
    this.transactionConcludedEvent.emit(concludedTransaction);
  }

  errorMessage: string | null = null;

  constructor(
    private readonly verifierEndpointService: VerifierEndpointService,
    private readonly navigateService: NavigateService,
    private readonly injector: Injector,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.localStorageService = this.injector.get(LocalStorageService);
    this.dialog = this.injector.get(MatDialog);
  }

  ngOnInit(): void {
    this.transaction = JSON.parse(
      this.localStorageService.get(ACTIVE_TRANSACTION)!,
    );

    if (!this.transaction) {
      this.navigateService.goHome();
    } else {
      this.triggerDcApiFlow();
    }
  }
  async triggerDcApiFlow(): Promise<void> {
    const { initialized_transaction } = this.transaction;

    const transactionId = initialized_transaction.transaction_id;
    if (!initialized_transaction) {
      return;
    }

    await this.createDCApiRequest(initialized_transaction as DcApiTransaction)
      .then((req) => navigator.credentials.get(req))
      .then((credential) => {
        const digitalCredential = credential as OpenId4VPDigitalCredential;
        const { response, error, error_description } = digitalCredential.data;
        const postResponse$ = error
          ? this.verifierEndpointService.postDcApiErrorResponse(transactionId, error, error_description)
          : this.verifierEndpointService.postDcApiWalletResponse(transactionId, response!);

        postResponse$
          .pipe(
            concatMap(() =>
              this.verifierEndpointService.getWalletResponse(transactionId),
            ),
          )
          .subscribe({
            next: (res: WalletResponse) => {
              const concludedTransaction = this.concludeTransaction(res);
              this.emitTransactionConcludedEvent(concludedTransaction);
            },
            error: (err) => {
              console.error(err);
              this.errorMessage = this.formatErrorMessage(err);
              this.cdr.detectChanges();
            },
          });
      })
      .catch((err) => {
        console.error(err);
        this.errorMessage = this.formatErrorMessage(err);
        this.cdr.detectChanges();
      });
  }

  private createDCApiRequest(
    initialized_transaction: DcApiTransaction,
  ): Promise<CredentialRequestOptions> {
    const protocol = 'openid4vp-v1-signed';
    if (!userAgentAllowsProtocol(protocol)) {
      return Promise.reject(
        new Error(`Protocol ${protocol} is not supported by the user agent`),
      );
    }
    return Promise.resolve({
      mediation: 'required' as const,
      digital: {
        requests: [
          {
            protocol: protocol,
            data: {
              request: initialized_transaction.request,
            },
          },
        ],
      },
    });
  }

  openLogs() {
    this.dialog.open(OpenLogsComponent, {
      data: {
        transactionId: this.transaction.initialized_transaction.transaction_id,
        label: 'Show Logs',
        isInspectLogs: false,
      },
    });
  }

  private formatErrorMessage(error: any): string {
    if (!error) {
      return 'An unknown error occurred while invoking the wallet.';
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error?.error) {
      const body = error.error;
      if (typeof body === 'string') {
        return body;
      }
      if (body?.error) {
        return body.error;
      }
      if (body?.message) {
        return body.message;
      }
    }

    if (error.message) {
      return error.message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  private concludeTransaction(response: WalletResponse): ConcludedTransaction {
    let concludedTransaction = {
      transactionId: this.transaction.initialized_transaction.transaction_id,
      nonce: this.transaction.initialization_request.nonce,
      presentationQuery: this.transaction.initialization_request!!.dcql_query,
      walletResponse: response,
      origin: (this.transaction.initialization_request!! as DCApiTransactionInitializationRequest).origin
    };
    // Clear local storage
    this.localStorageService.remove(constants.ACTIVE_TRANSACTION);

    return concludedTransaction;
  }
}
