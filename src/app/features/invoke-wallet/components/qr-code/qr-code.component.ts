import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {DataService} from '@core/services/data.service';
import {interval, ReplaySubject, Subject, take, takeUntil} from 'rxjs';
import {map} from 'rxjs/operators';
import {NavigateService} from '@core/services/navigate.service';
import {InitializedTransaction} from '@core/models/InitializedTransaction';
import {PresentationsResultsComponent} from '../presentations-results/presentations-results.component';
import {DeviceDetectorService} from '@core/services/device-detector.service';
import {LocalStorageService} from '@core/services/local-storage.service';
import * as constants from '@core/constants/constants';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {OpenLogsComponent} from '@shared/elements/open-logs/open-logs.component';
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {WalletResponse} from "@core/models/WalletResponse";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let QRCode: any;

@Component({
  selector: 'vc-qr-code',
  standalone: true,
  imports: [CommonModule, SharedModule, PresentationsResultsComponent, OpenLogsComponent, MatDialogModule],
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
  @ViewChild('qrCode') qrCode!: ElementRef;

  isCrossDevice = true;
  transaction!: InitializedTransaction;

  redirectUrl!: string;
  scheme!: string;
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
    this.transaction = this.dataService.initializedTransaction as InitializedTransaction;
    if (!this.transaction) {
      this.navigateService.goHome();
    } else {
      this.redirectUrl = this.buildQrCode(this.transaction);
      if (this.isCrossDevice) {
        this.pollingRequest(this.transaction.transaction_id);
      }
    }
  }

  ngAfterViewInit() {
    if (this.isCrossDevice) {
      new QRCode(this.qrCode.nativeElement, this.redirectUrl);
    }
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
              this.localStorageService.remove(constants.UI_PRESENTATION);
              this.stopPlay$.next(1);
              this.emitTransactionConcludedEvent(this.concludeTransaction(res))
              // Reset state
              this.dataService.setInitializationRequest(null);
              this.dataService.setInitializedTransaction(null);
            },
          );
      });
  }

  private concludeTransaction(response: WalletResponse): ConcludedTransaction {
    return {
      transactionId: this.dataService.initializedTransaction!!.transaction_id,
      presentationDefinition: this.dataService.initializationRequest!!.presentation_definition,
      walletResponse: response,
    }
  }

  private buildQrCode(data: { client_id: string, request_uri: string, transaction_id: string }): string {
    return `${this.scheme}?client_id=${data.client_id}&request_uri=${encodeURIComponent(data.request_uri)}`;
  }

  openLogs() {
    this.dialog.open(OpenLogsComponent, {
      data: {
        transactionId: this.transaction.transaction_id,
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
