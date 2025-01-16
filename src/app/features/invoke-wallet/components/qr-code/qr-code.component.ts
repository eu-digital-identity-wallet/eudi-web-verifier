import {ChangeDetectionStrategy, Component, EventEmitter, Injector, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {DataService} from '@core/services/data.service';
import {interval, ReplaySubject, Subject, take, takeUntil} from 'rxjs';
import {map} from 'rxjs/operators';
import {NavigateService} from '@core/services/navigate.service';
import {PresentationsResultsComponent} from '../presentations-results/presentations-results.component';
import {DeviceDetectorService} from '@core/services/device-detector.service';
import {LocalStorageService} from '@core/services/local-storage.service';
import * as constants from '@core/constants/general';
import {ACTIVE_TRANSACTION} from '@core/constants/general';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {OpenLogsComponent} from '@shared/elements/open-logs/open-logs.component';
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {WalletResponse} from "@core/models/WalletResponse";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {QRCodeModule} from 'angularx-qrcode';
import {SafeUrl} from "@angular/platform-browser";
import {ActiveTransaction} from "@core/models/ActiveTransaction";


@Component({
  selector: 'vc-qr-code',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    PresentationsResultsComponent,
    OpenLogsComponent,
    MatDialogModule,
    QRCodeModule
  ],
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
  providers: [VerifierEndpointService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent implements OnInit, OnDestroy {

  private readonly deviceDetectorService!: DeviceDetectorService;
  private readonly localStorageService!: LocalStorageService;

  destroy$ = new Subject();
  stopPlay$ = new ReplaySubject(1);

  isCrossDevice = true;
  transaction!: ActiveTransaction;

  deepLinkTxt!: string;
  scheme!: string;
  qrCodeDownloadLink!: SafeUrl;
  readonly dialog!: MatDialog;

  @Output() transactionConcludedEvent = new EventEmitter<ConcludedTransaction>();

  emitTransactionConcludedEvent(concludedTransaction: ConcludedTransaction) {
    this.transactionConcludedEvent.emit(concludedTransaction);
  }

  constructor(
    private readonly verifierEndpointService: VerifierEndpointService,
    private readonly dataService: DataService,
    private readonly navigateService: NavigateService,
    private readonly injector: Injector,
  ) {
    this.deviceDetectorService = this.injector.get(DeviceDetectorService);
    this.localStorageService = this.injector.get(LocalStorageService);
    this.dialog = this.injector.get(MatDialog);
    this.isCrossDevice = this.deviceDetectorService.isDesktop();

    if (this.localStorageService.get(constants.SCHEME)) {
      this.scheme = this.localStorageService.get(constants.SCHEME) ?? constants.DEFAULT_SCHEME;
    } else {
      this.scheme = constants.DEFAULT_SCHEME;
    }
  }

  ngOnInit(): void {
    this.transaction = JSON.parse(
      this.localStorageService.get(ACTIVE_TRANSACTION)!!
    );
    if (!this.transaction) {
      this.navigateService.goHome();
    } else {
      this.deepLinkTxt = this.buildQrCode(this.transaction.initialized_transaction);
      if (this.isCrossDevice) {
        this.pollingRequest(this.transaction.initialized_transaction.transaction_id);
      }
    }
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  pollingRequest(transaction_id: string) {
    const source = interval(2000);
    source
      .pipe(
        takeUntil(this.stopPlay$),
        take(60)
      )
      .subscribe(() => {
        this.verifierEndpointService.getWalletResponse(transaction_id)
          .pipe(
            takeUntil(this.stopPlay$),
            map((data) => data as WalletResponse),
          )
          .subscribe(
            (res: WalletResponse) => {
              this.stopPlay$.next(1);
              let concludedTransaction = this.concludeTransaction(res);
              this.emitTransactionConcludedEvent(concludedTransaction)
            },
          );
      });
  }

  private concludeTransaction(response: WalletResponse): ConcludedTransaction {
    let concludedTransaction = {
      transactionId: this.transaction.initialized_transaction.transaction_id,
      presentationDefinition: this.transaction.initialization_request.presentation_definition,
      walletResponse: response,
      nonce: this.transaction.initialization_request.nonce
    }
    // Clear local storage
    this.localStorageService.remove(constants.ACTIVE_TRANSACTION);

    return concludedTransaction;
  }

  private buildQrCode(data: { client_id: string, request_uri: string, transaction_id: string }): string {
    return `${this.scheme}?client_id=${encodeURIComponent(data.client_id)}&request_uri=${encodeURIComponent(data.request_uri)}`;
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
