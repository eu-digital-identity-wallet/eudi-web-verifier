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
import {
  isDCApiSupported,
  userAgentAllowsProtocol,
} from '@shared/utils/dc-api-utils';
import { OpenId4VPDigitalCredential } from './model/DigitalCredential';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '@shared/shared.module';
import { NavigateService } from '@core/services/navigate.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  SignedDcApiTransaction,
  UnsignedDcApiTransaction,
} from '@core/models/InitializedTransaction';
import { MatButtonModule } from '@angular/material/button';
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
    const { initialized_transaction, initialization_request } =
      this.transaction;

    if (!initialized_transaction) {
      return;
    }

    const response = await this.createDCApiRequest(
      initialization_request as DCApiTransactionInitializationRequest,
      initialized_transaction as
        | SignedDcApiTransaction
        | UnsignedDcApiTransaction,
    )
      .then((req) => navigator.credentials.get(req))
      .catch((err) => {
        this.errorMessage = this.formatErrorMessage(err);
        this.cdr.detectChanges();
      });
    if (!response) return;

    const digitalCredential = response as OpenId4VPDigitalCredential;
    const walletResponse = digitalCredential.data;

    if (walletResponse) {
      const concludedTransaction = this.concludeTransaction(walletResponse);
      this.emitTransactionConcludedEvent(concludedTransaction);
    }
  }

  private createDCApiRequest(
    initialization_request: DCApiTransactionInitializationRequest,
    initialized_transaction: SignedDcApiTransaction | UnsignedDcApiTransaction,
  ): Promise<CredentialRequestOptions> {
    const isSigned =
      (initialization_request as DCApiTransactionInitializationRequest)
        .request_type === 'signed';
    return isSigned
      ? this.getSignedDCApiRequest(
          initialized_transaction as SignedDcApiTransaction,
        )
      : this.getUnsignedDCApiRequest(
          initialized_transaction as UnsignedDcApiTransaction,
        );
  }

  private getSignedDCApiRequest(
    initialized_transaction: SignedDcApiTransaction,
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
              request: (initialized_transaction as SignedDcApiTransaction)
                .request,
            },
          },
        ],
      },
    });
  }

  private getUnsignedDCApiRequest(
    initialized_transaction: UnsignedDcApiTransaction,
  ): Promise<CredentialRequestOptions> {
    const protocol = 'openid4vp-v1-unsigned';
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
              ...(initialized_transaction as UnsignedDcApiTransaction).request,
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
    };
    // Clear local storage
    this.localStorageService.remove(constants.ACTIVE_TRANSACTION);

    return concludedTransaction;
  }

}
