import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {HttpService} from '@network/http/http.service';
import {LocalStorageService} from './local-storage.service';
import * as constants from '@core/constants/general';
import {DeviceDetectorService} from './device-detector.service';
import {DCApiTransactionInitializationRequest, RedirectsTransactionInitializationRequest, TransactionInitializationRequest} from "@core/models/TransactionInitializationRequest";
import {DcApiTransaction, InitializedTransaction} from "@core/models/InitializedTransaction";
import {WalletResponse} from "@core/models/WalletResponse";
import {EventLog} from "@core/models/EventLog";
import {HttpHeaders} from "@angular/common/http";
import {ActiveTransaction} from "@core/models/ActiveTransaction";
import {SessionStorageService} from './session-storage.service';
import {IntendedUse} from "@core/models/IntendedUse";

const SAME_DEVICE_UI_RE_ENTRY_URL = '/get-wallet-code?response_code={RESPONSE_CODE}';
const INIT_TRANSACTION_ENDPOINT = 'ui/presentations/v2';
const INIT_DC_API_TRANSACTION_ENDPOINT = 'ui/presentations/dc-api'
const POST_DC_API_RESPONSE_ENDPOINT = 'ui/presentations/${transactionId}/dc-api'
const WALLET_RESPONSE_ENDPOINT = 'ui/presentations/${transactionId}';
const EVENTS_ENDPOINT = 'ui/presentations/${transactionId}/events';
const VALIDATE_SD_JWT_VC_PRESENTATION_ENDPOINT = 'utilities/validations/sdJwtVc';
const INTENDED_USES_ENDPOINT = 'ui/intended-uses';

@Injectable()
export class VerifierEndpointService {

  constructor(
    private readonly httpService: HttpService,
    private readonly localStorageService: LocalStorageService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly deviceDetectorService: DeviceDetectorService,
  ) {
  }

  initializeRedirectsTransaction(initializationRequest: RedirectsTransactionInitializationRequest, callback: (value: InitializedTransaction) => void) {
    if (initializationRequest) {
      const payload: any = {...initializationRequest};
      if (!this.deviceDetectorService.isDesktop()) {
        payload['wallet_response_redirect_uri_template'] = location.origin + SAME_DEVICE_UI_RE_ENTRY_URL;
      }
      this.httpService.post<InitializedTransaction, string>(INIT_TRANSACTION_ENDPOINT, payload)
        .pipe(
          tap((res) => {
            let activeTransaction : ActiveTransaction = {
              initialized_transaction: res,
              initialization_request: initializationRequest
            }
            this.localStorageService.set(constants.ACTIVE_TRANSACTION, JSON.stringify(activeTransaction));
          })
        ).subscribe(callback);
    }
  }

  initializeDcApiTransaction(initializationRequest: DCApiTransactionInitializationRequest, callback: (value: InitializedTransaction) => void) {
    if (initializationRequest) {
      this.httpService.post<DcApiTransaction, DCApiTransactionInitializationRequest>(INIT_DC_API_TRANSACTION_ENDPOINT, initializationRequest)
        .pipe(
          tap((res) => {
            let activeTransaction : ActiveTransaction = {
              initialized_transaction: res,
              initialization_request: initializationRequest
            }
            this.localStorageService.set(constants.ACTIVE_TRANSACTION, JSON.stringify(activeTransaction));
          })
        ).subscribe(callback);
    }
  }

  postDcApiWalletResponse(transactionId: string, response: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams();
    body.set('response', response);
    return this.httpService.post<any, string>(
      POST_DC_API_RESPONSE_ENDPOINT.replace('${transactionId}', transactionId),
      body.toString(),
      { headers }
    );
  }

  postDcApiErrorResponse(transactionId: string, error: string, errorDescription?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams();
    body.set('error', error);
    if (errorDescription) {
      body.set('error_description', errorDescription);
    }
    return this.httpService.post<any, string>(
      POST_DC_API_RESPONSE_ENDPOINT.replace('${transactionId}', transactionId),
      body.toString(),
      { headers }
    );
  }

  getWalletResponse(transaction_id: string, code?: string): Observable<WalletResponse> {
    if (typeof code == 'undefined') {
      return this.httpService.get(WALLET_RESPONSE_ENDPOINT.replace('${transactionId}', transaction_id));
    } else {
      return this.httpService.get(WALLET_RESPONSE_ENDPOINT.replace('${transactionId}', transaction_id) + `?response_code=${code}`);
    }
  }

  getsTransactionEventsLogs(transactionId: string): Observable<EventLog[]> {
    return this.httpService.get(EVENTS_ENDPOINT.replace('${transactionId}', transactionId))
      .pipe(
        map((data: any) => {
          return data.events.map((event: EventLog) => {
            let data = { };
            this.getTransactionData(event)
              .forEach((key: string) => {
                const value = event[key as keyof EventLog];
                data = { ...data, [key]: value}
              });
            event.data = data;
            return event;
          });
        })
      );
  }

  validateSdJwtVc(payload: string, nonce: string, origin?: string): Observable<any> {
    const issuerChain = this.sessionStorageService.get(constants.ISSUER_CHAIN) ?? undefined;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    // Convert object to form data string
    const body = new URLSearchParams();
    body.set('sd_jwt_vc', payload);
    body.set('nonce', nonce);
    if(origin) {
      body.set('audience', `origin:${origin}`);
    }
    issuerChain && body.set('issuer_chain', issuerChain);

    return this.httpService.post<any, string>(VALIDATE_SD_JWT_VC_PRESENTATION_ENDPOINT, body.toString(), {headers})
  }

  getIntendedUses(): Observable<IntendedUse[]> {
    return this.httpService.get<{ intended_uses: IntendedUse[] }>(INTENDED_USES_ENDPOINT)
      .pipe(map((data) => data.intended_uses ?? []));
  }

  private getTransactionData(event: EventLog): string[] {
    const objKeys = Object.keys(event);
    objKeys.splice(objKeys.indexOf('timestamp'), 1);
    objKeys.splice(objKeys.indexOf('event'), 1);
    objKeys.splice(objKeys.indexOf('actor'), 1);
    return objKeys;
  }
}
