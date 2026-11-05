import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {SharedModule} from '@shared/shared.module';
import {interval, ReplaySubject, Subject, take, takeUntil} from 'rxjs';
import {map} from 'rxjs/operators';
import {NavigateService} from '@core/services/navigate.service';
import {DeviceDetectorService} from '@core/services/device-detector.service';
import {LocalStorageService} from '@core/services/local-storage.service';
import * as constants from '@core/constants/general';
import {ACTIVE_TRANSACTION} from '@core/constants/general';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {OpenLogsComponent} from '@shared/elements/open-logs/open-logs.component';
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {WalletResponse} from "@core/models/WalletResponse";
import {EventLog} from "@core/models/EventLog";
import {GetWalletResponseErrorCode, PresentationEventName} from "@core/models/WalletResponseErrors";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {QRCodeComponent} from 'angularx-qrcode';
import {SafeUrl} from "@angular/platform-browser";
import {ActiveTransaction} from "@core/models/ActiveTransaction";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {RedirectsTransaction} from "@core/models/InitializedTransaction";

@Component({
    selector: 'vc-qr-code',
    imports: [
        CommonModule,
        SharedModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatProgressBarModule,
        QRCodeComponent
    ],
    templateUrl: './qr-code.component.html',
    styleUrls: ['./qr-code.component.scss'],
    providers: [VerifierEndpointService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent implements OnInit, OnDestroy {

  private static readonly POLL_INTERVAL_MS = 2000;
  private static readonly MAX_POLLS = 60;
  private static readonly REJECTED_SUBMISSION_MESSAGE =
    'The wallet submitted a response, but the verifier rejected it. Check the transaction logs for details.';
  private static readonly TIMEOUT_MESSAGE =
    'No response was received from the wallet within 2 minutes. ' +
    'The presentation may have failed or been rejected. Check the transaction logs for details.';

  private readonly deviceDetectorService!: DeviceDetectorService;
  private readonly localStorageService!: LocalStorageService;
  private readonly changeDetectorRef!: ChangeDetectorRef;

  destroy$ = new Subject();
  stopPlay$ = new ReplaySubject(1);

  isCrossDevice = true;
  transaction!: ActiveTransaction;
  errorMessage: string | null = null;
  private finished = false;

  deepLinkTxt!: string;

  qrCodeDownloadLink!: SafeUrl;
  readonly dialog!: MatDialog;

  @Output() transactionConcludedEvent = new EventEmitter<ConcludedTransaction>();

  emitTransactionConcludedEvent(concludedTransaction: ConcludedTransaction) {
    this.transactionConcludedEvent.emit(concludedTransaction);
  }

  constructor(
    private readonly verifierEndpointService: VerifierEndpointService,
    private readonly navigateService: NavigateService,
    private readonly injector: Injector,
  ) {
    this.deviceDetectorService = this.injector.get(DeviceDetectorService);
    this.localStorageService = this.injector.get(LocalStorageService);
    this.dialog = this.injector.get(MatDialog);
    this.changeDetectorRef = this.injector.get(ChangeDetectorRef);
    this.isCrossDevice = this.deviceDetectorService.isDesktop();
  }

  ngOnInit(): void {
    this.transaction = JSON.parse(
      this.localStorageService.get(ACTIVE_TRANSACTION)!
    );
    if (!this.transaction) {
      this.navigateService.goHome();
    } else {
      const redirectsTransaction = this.transaction.initialized_transaction as RedirectsTransaction
      this.deepLinkTxt = redirectsTransaction.authorization_request_uri;
      if (this.isCrossDevice) {
        this.pollingRequest(this.transaction.initialized_transaction.transaction_id);
      }
    }
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  private pollingRequest(transaction_id: string) {
    const source = interval(QrCodeComponent.POLL_INTERVAL_MS);
    source
      .pipe(
        takeUntil(this.stopPlay$),
        take(QrCodeComponent.MAX_POLLS)
      )
      .subscribe({
        next: () => this.fetchWalletResponse(transaction_id),
        complete: () => this.finishWithError(QrCodeComponent.TIMEOUT_MESSAGE),
      });
  }

  private fetchWalletResponse(transaction_id: string) {
    this.verifierEndpointService.getWalletResponse(transaction_id)
      .pipe(
        takeUntil(this.stopPlay$),
        map((data) => data as WalletResponse),
      )
      .subscribe({
        next: (res: WalletResponse) => this.handleWalletResponse(res),
        error: (err) => this.handlePollError(transaction_id, err),
      });
  }

  private handleWalletResponse(res: WalletResponse) {
    if (this.finished) {
      return;
    }
    if (res.error) {
      this.finishWithError(res.error_description || res.error);
    } else {
      this.finished = true;
      this.stopPlay$.next(1);
      const concludedTransaction = this.concludeTransaction(res);
      this.emitTransactionConcludedEvent(concludedTransaction);
    }
  }

  private handlePollError(transaction_id: string, err: any) {
    if (this.finished) {
      return;
    }
    if (this.isTransientPollError(err)) {
      this.checkFailedWalletSubmission(transaction_id);
    } else {
      this.finishWithError(this.formatErrorMessage(err));
    }
  }

  private checkFailedWalletSubmission(transaction_id: string) {
    this.verifierEndpointService.getsTransactionEventsLogs(transaction_id)
      .pipe(takeUntil(this.stopPlay$))
      .subscribe({
        next: (events: EventLog[]) => this.handleEvents(events),
        error: () => {
          // The wallet-response poll remains authoritative; ignore transient events errors.
        },
      });
  }

  private handleEvents(events: EventLog[]) {
    if (this.finished) {
      return;
    }
    const failed = events.find((e) => e.event === PresentationEventName.WALLET_FAILED_TO_POST);
    if (!failed) {
      return;
    }
    const cause = (failed.data as Record<string, unknown> | undefined)?.['cause'];
    this.finishWithError(
      typeof cause === 'string' && cause ? cause : QrCodeComponent.REJECTED_SUBMISSION_MESSAGE
    );
  }

  private isTransientPollError(err: any): boolean {
    if (!(err instanceof HttpErrorResponse)) {
      return false;
    }
    if (err.status === 404) {
      return true;
    }
    const body = err.error;
    return err.status === 400 && !!body && typeof body === 'object' && body.error === GetWalletResponseErrorCode.PRESENTATION_NOT_SUBMITTED;
  }

  private finishWithError(message: string) {
    if (!this.finished) {
      this.finished = true;
      this.stopPlay$.next(1);
      this.errorMessage = message;
      this.changeDetectorRef.detectChanges();
    }
  }

  private formatErrorMessage(error: any): string {
    if (!error) {
      return 'An unknown error occurred while waiting for the wallet response.';
    }
    if (typeof error === 'string') {
      return error;
    }
    const body = error.error;
    if (typeof body === 'string' && body) {
      return body;
    }
    if (body && typeof body === 'object') {
      return body.error ?? body.message ?? JSON.stringify(body);
    }
    return error.message ?? 'An unknown error occurred while waiting for the wallet response.';
  }

  private concludeTransaction(response: WalletResponse): ConcludedTransaction {
    let concludedTransaction = {
      transactionId: this.transaction.initialized_transaction.transaction_id,
      presentationQuery: this.transaction.initialization_request!!.dcql_query,
      walletResponse: response,
      nonce: this.transaction.initialization_request.nonce
    }
    // Clear local storage
    this.localStorageService.remove(constants.ACTIVE_TRANSACTION);

    return concludedTransaction;
  }

  openLogs() {
    this.dialog.open(OpenLogsComponent, {
      data: {
        transactionId: this.transaction.initialized_transaction.transaction_id,
        label: 'Show Logs',
        isInspectLogs: false
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
    this.stopPlay$.next('');
    this.stopPlay$.complete();
  }
}
