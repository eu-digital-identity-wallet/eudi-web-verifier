import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {HttpService} from '@network/http/http.service';
import {LocalStorageService} from './local-storage.service';
import * as constants from '@core/constants/general';
import {DeviceDetectorService} from './device-detector.service';
import {TransactionInitializationRequest} from "@core/models/TransactionInitializationRequest";
import {InitializedTransaction} from "@core/models/InitializedTransaction";
import {DataService} from "@core/services/data.service";
import {WalletResponse} from "@core/models/WalletResponse";
import {EventLog} from "@core/models/EventLog";

@Injectable()
export class VerifierEndpointService {

	constructor (
    private readonly httpService: HttpService,
    private readonly localStorageService: LocalStorageService,
    private readonly dataService: DataService,
    private readonly deviceDetectorService: DeviceDetectorService,
	) { }

  initializeTransaction(initializationRequest: TransactionInitializationRequest, callback: (value: InitializedTransaction) => void) {
    if (initializationRequest) {
      const payload: any = {...initializationRequest};
      if (!this.deviceDetectorService.isDesktop()) {
        payload['wallet_response_redirect_uri_template'] = location.origin + '/get-wallet-code?response_code={RESPONSE_CODE}';
      }
      this.httpService.post<InitializedTransaction, string>('ui/presentations', payload)
        .pipe(
          tap((res) => {
            this.localStorageService.set(constants.ACTIVE_TRANSACTION, JSON.stringify(res));
            this.localStorageService.set(constants.ACTIVE_PRESENTATION_DEFINITION, JSON.stringify(initializationRequest.presentation_definition));
            this.dataService.setInitializationRequest(initializationRequest);
            this.dataService.setInitializedTransaction(res);
          })
        ).subscribe(callback);
    }
  }

  getWalletResponse(transaction_id: string, code?: string): Observable<WalletResponse> {
    if (typeof code == 'undefined') {
      return this.httpService.get(`ui/presentations/${transaction_id}`);
    } else {
      return this.httpService.get(`ui/presentations/${transaction_id}?response_code=${code}`);
    }
  }

  getsTransactionEventsLogs(transactionId: string): Observable<EventLog[]> {
    return this.httpService.get(`ui/presentations/${transactionId}/events`)
      .pipe(
        map((data: any) => {
          return data.events.map((event: EventLog) => {
            this.getTransactionData(event).forEach((key: string) => {
              const value = event[key as keyof EventLog] ?? {};
              event.data = {
                key: key,
                value,
              };
            });
            return event;
          });
        })
      );
  }

  private getTransactionData(event: EventLog): string[] {
    const objKeys = Object.keys(event);
    objKeys.splice(objKeys.indexOf('timestamp'), 1);
    objKeys.splice(objKeys.indexOf('event'), 1);
    objKeys.splice(objKeys.indexOf('actor'), 1);
    return objKeys;
  }
}
