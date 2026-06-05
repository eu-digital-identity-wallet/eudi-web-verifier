import {ChangeDetectionStrategy, Component, EventEmitter, Injector, OnInit, Output} from '@angular/core';
import {VerifierEndpointService} from "../../../../core/services/verifier-endpoint.service";
import {DeviceDetectorService} from "../../../../core/services/device-detector.service";
import {LocalStorageService} from "../../../../core/services/local-storage.service";
import * as constants from "@core/constants/general";
import {ACTIVE_TRANSACTION} from "@core/constants/general";
import {ActiveTransaction} from "@core/models/ActiveTransaction";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {WalletResponse} from "@core/models/WalletResponse";
import {defer} from 'rxjs';
import {OpenLogsComponent} from "@shared/elements/open-logs/open-logs.component";
import {DigitalCredential} from "./model/DigitalCredential";
import {CommonModule} from "@angular/common";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {SharedModule} from '@shared/shared.module';
import {map} from 'rxjs/operators';
import {NavigateService} from "@core/services/navigate.service";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DcApiTransaction} from "@core/models/InitializedTransaction";

@Component({
  selector: 'vc-dc-api',
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule
  ],
  templateUrl: './dc-api.component.html',
  styleUrls: ['./dc-api.component.scss'],
  providers: [VerifierEndpointService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DcApiComponent implements OnInit {

  private readonly deviceDetectorService!: DeviceDetectorService;
  private readonly localStorageService!: LocalStorageService;

  readonly dialog!: MatDialog;

  transaction!: ActiveTransaction;

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
  }

  ngOnInit(): void {
    this.transaction = JSON.parse(
      this.localStorageService.get(ACTIVE_TRANSACTION)!
    );

    if (!this.transaction) {
      this.navigateService.goHome();
    } else {
      this.triggerDcApiFlow()
    }
  }

  triggerDcApiFlow() {
    defer(() => this.doDcApi())
      .pipe(
        map((data) => data as WalletResponse),
      )
      .subscribe(
        (res: WalletResponse) => {
          if (res != null) {
            console.log("CONCLUDING DC API FLOW WITH WALLET RESPONSE: ")
            console.log(res)
            let concludedTransaction = this.concludeTransaction(res);
            this.emitTransactionConcludedEvent(concludedTransaction)
          }
        },
      );
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

  private async doDcApi(): Promise<WalletResponse | null> {

    if ('requestPayload' in this.transaction.initialized_transaction) {
      let dcApiTransaction = this.transaction.initialized_transaction as DcApiTransaction;

      console.log(dcApiTransaction)

      const providers = [
        {
          protocol: 'openid4vp-v1-signed',
          data: {
            request: dcApiTransaction.requestPayload
          }
        }
      ];

      try {
        const digitalObj = {
          digital: {
            requests: providers
          }
        }

        const response = await navigator.credentials.get({
          ...digitalObj,
          mediation: 'required',
        });

        console.log(response)

        const digitalCredential = response as DigitalCredential;

        // let vpToken: WalletResponse = {}

        if (digitalCredential.data == null) {
          throw new Error('No digital credential found');

        } else if (typeof digitalCredential.data === 'string') {
          throw new Error('Expected object, got string');

        } else {
          return digitalCredential.data as WalletResponse
        }

        // return vpToken

      } catch (err) {
        console.info(err);
        alert(err)
        return null
      }
    } else {
      return null
    }
  }

  private concludeTransaction(response: WalletResponse): ConcludedTransaction {
    let concludedTransaction = {
      transactionId: this.transaction.initialized_transaction.transaction_id,
      nonce: this.transaction.initialization_request.nonce,
      presentationQuery: this.transaction.initialization_request!!.dcql_query,
      walletResponse: response
    }
    // Clear local storage
    this.localStorageService.remove(constants.ACTIVE_TRANSACTION);

    return concludedTransaction;
  }

}
