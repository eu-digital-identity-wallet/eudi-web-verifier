import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {HttpService} from '@network/http/http.service';
import {LocalStorageService} from './local-storage.service';
import * as constants from '@core/constants/general';
import {DeviceDetectorService} from './device-detector.service';
import {TransactionInitializationRequest} from "@core/models/TransactionInitializationRequest";
import {DcApiTransaction, InitializedTransaction} from "@core/models/InitializedTransaction";
import {WalletResponse} from "@core/models/WalletResponse";
import {EventLog} from "@core/models/EventLog";
import {HttpHeaders} from "@angular/common/http";
import {ActiveTransaction} from "@core/models/ActiveTransaction";
import {SessionStorageService} from './session-storage.service';

const SAME_DEVICE_UI_RE_ENTRY_URL = '/get-wallet-code?response_code={RESPONSE_CODE}';
const INIT_TRANSACTION_ENDPOINT = 'ui/presentations/v2';
const WALLET_RESPONSE_ENDPOINT = 'ui/presentations/${transactionId}';
const EVENTS_ENDPOINT = 'ui/presentations/${transactionId}/events';
const VALIDATE_SD_JWT_VC_PRESENTATION_ENDPOINT = 'utilities/validations/sdJwtVc';

@Injectable()
export class VerifierEndpointService {

  constructor(
    private readonly httpService: HttpService,
    private readonly localStorageService: LocalStorageService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly deviceDetectorService: DeviceDetectorService,
  ) {
  }

  initializeTransaction(initializationRequest: TransactionInitializationRequest, callback: (value: InitializedTransaction) => void) {
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

  initializeDcApiTransaction(initializationRequest: TransactionInitializationRequest, callback: (value: InitializedTransaction) => void) {
    if (initializationRequest) {
      const payload: any = {...initializationRequest};
      // TODO: Init DcApi Transaction in backend's dedicated init transaction endpoint for dc-api
      this.httpService.post<InitializedTransaction, string>(INIT_TRANSACTION_ENDPOINT, payload)
        .pipe(
          tap((res) => {

            const dcApiTransaction : DcApiTransaction = {
              transaction_id: res.transaction_id,
              requestPayload: 'eyJhbGciOiJFUzI1NiIsInR5cCI6Im9hdXRoLWF1dGh6LXJlcStqd3QiLCJ4NWMiOlsiTUlJQ3FqQ0NBbEdnQXdJQkFnSVVXcVlEaTZjZy9YeEFDbDU1U1hJS3I5cVRGak13Q2dZSUtvWkl6ajBFQXdJd2VqRUxNQWtHQTFVRUJoTUNWVk14RXpBUkJnTlZCQWdNQ2tOaGJHbG1iM0p1YVdFeEZqQVVCZ05WQkFjTURVMXZkVzUwWVdsdUlGWnBaWGN4SERBYUJnTlZCQW9NRTBScFoybDBZV3dnUTNKbFpHVnVkR2xoYkhNeElEQWVCZ05WQkFNTUYyUnBaMmwwWVd3dFkzSmxaR1Z1ZEdsaGJITXVaR1YyTUI0WERUSTFNRFF5TlRFek5URXdPRm9YRFRNMU1EUXhNekV6TlRFd09Gb3dlakVMTUFrR0ExVUVCaE1DVlZNeEV6QVJCZ05WQkFnTUNrTmhiR2xtYjNKdWFXRXhGakFVQmdOVkJBY01EVTF2ZFc1MFlXbHVJRlpwWlhjeEhEQWFCZ05WQkFvTUUwUnBaMmwwWVd3Z1EzSmxaR1Z1ZEdsaGJITXhJREFlQmdOVkJBTU1GMlJwWjJsMFlXd3RZM0psWkdWdWRHbGhiSE11WkdWMk1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRVgxbEVSYzlqNHBlbjdvRmszVU1FSEJjUEhvVlFYWDdXdkRwUkhNM1czdDNjeFNLRlA3T3dRcVJHNlZWQ01QdzJqeXM0NHpQTHZDaCtWNndDQlZ4R2FhT0J0RENCc1RBZEJnTlZIUTRFRmdRVTAwRm1Kd2kvazNlT09CU2Q5MnM0K1dYbnpIOHdId1lEVlIwakJCZ3dGb0FVMDBGbUp3aS9rM2VPT0JTZDkyczQrV1huekg4d0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBT0JnTlZIUThCQWY4RUJBTUNCNEF3S2dZRFZSMFNCQ013SVlZZmFIUjBjSE02THk5a2FXZHBkR0ZzTFdOeVpXUmxiblJwWVd4ekxtUmxkakFpQmdOVkhSRUVHekFaZ2hka2FXZHBkR0ZzTFdOeVpXUmxiblJwWVd4ekxtUmxkakFLQmdncWhrak9QUVFEQWdOSEFEQkVBaUVBdzA4bVozQUdtc1lKZnZ2Vldia0MwV1E2WVdVUlhXaFE2Vnh5ZlllQ2pnc0NIeElnLzh5TkJ6RDBNRndRcnBXWVhKTkxvbHdHYlpPSjM0TUI0eVdsemtvPSJdfQ.eyJyZXNwb25zZV90eXBlIjogInZwX3Rva2VuIiwgInJlc3BvbnNlX21vZGUiOiAiZGNfYXBpIiwgIm5vbmNlIjogIjFxS3BQd21DRUxLQmRUTC1JSW5ucDJFajc4ci1MMThXUkRnWklveGtiT1UiLCAiZGNxbF9xdWVyeSI6IHsiY3JlZGVudGlhbHMiOiBbeyJpZCI6ICJjcmVkMSIsICJmb3JtYXQiOiAibXNvX21kb2MiLCAibWV0YSI6IHsiZG9jdHlwZV92YWx1ZSI6ICJvcmcuaXNvLjE4MDEzLjUuMS5tREwifSwgImNsYWltcyI6IFt7InBhdGgiOiBbIm9yZy5pc28uMTgwMTMuNS4xIiwgImZhbWlseV9uYW1lIl19LCB7InBhdGgiOiBbIm9yZy5pc28uMTgwMTMuNS4xIiwgImdpdmVuX25hbWUiXX0sIHsicGF0aCI6IFsib3JnLmlzby4xODAxMy41LjEiLCAiYWdlX292ZXJfMjEiXX1dfV19LCAiY2xpZW50X21ldGFkYXRhIjogeyJ2cF9mb3JtYXRzX3N1cHBvcnRlZCI6IHsibXNvX21kb2MiOiB7Imlzc3VlcmF1dGhfYWxnX3ZhbHVlcyI6IFstN10sICJkZXZpY2VhdXRoX2FsZ192YWx1ZXMiOiBbLTddfX19LCAiY2xpZW50X2lkIjogIng1MDlfaGFzaDpmMWRyR0xPSVQ0a0RCbEpWc0QtXzMzaWdTZjV1d1JucTN5TzJOdmNYRVcwIiwgImV4cGVjdGVkX29yaWdpbnMiOiBbImh0dHBzOi8vZGlnaXRhbC1jcmVkZW50aWFscy5kZXYiXX0.0v2A6iqipVi3d5j3WJ0OOz3PkYMsMhCZ9zAkPy-4MeoGIAi_scaXR0UmgJ6gXlstCyBh_lRh8xzECt9XTyoPzA',
              origin: window.location.origin,
              host: window.location.host,
            }

            let activeTransaction : ActiveTransaction = {
              initialized_transaction: dcApiTransaction,
              initialization_request: initializationRequest
            }
            this.localStorageService.set(constants.ACTIVE_TRANSACTION, JSON.stringify(activeTransaction));
          })
        ).subscribe(callback);
    }
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

  validateSdJwtVc(payload: string, nonce: string): Observable<any> {
    const issuerChain = this.sessionStorageService.get(constants.ISSUER_CHAIN) ?? undefined;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    // Convert object to form data string
    const body = new URLSearchParams();
    body.set('sd_jwt_vc', payload);
    body.set('nonce', nonce);
    issuerChain && body.set('issuer_chain', issuerChain);

    return this.httpService.post<any, string>(VALIDATE_SD_JWT_VC_PRESENTATION_ENDPOINT, body.toString(), {headers})
  }

  private getTransactionData(event: EventLog): string[] {
    const objKeys = Object.keys(event);
    objKeys.splice(objKeys.indexOf('timestamp'), 1);
    objKeys.splice(objKeys.indexOf('event'), 1);
    objKeys.splice(objKeys.indexOf('actor'), 1);
    return objKeys;
  }
}
