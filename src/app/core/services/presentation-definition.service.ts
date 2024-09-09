import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/network/http/http.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { isJSON } from '../utils/ValidationJSON';
import { PresentationDefinitionResponse } from '../models/presentation-definition-response';
import { PresentationsResponse } from '../models/presentations-response';
import { LocalStorageService } from './local-storage.service';
import * as constants from '@core/constants/constants';
import { DeviceDetectorService } from './device-detector.service';
import { EventLog } from '../models/event-log';

@Injectable()
export class PresentationDefinitionService {

	constructor (
    private readonly httpService: HttpService,
    private readonly localStorageService: LocalStorageService,
    private readonly deviceDetectorService: DeviceDetectorService
	) { }

	getWalletResponseWithCode (transaction_id: string, code: string) : Observable<PresentationsResponse> {
		return this.httpService.get(`ui/presentations/${transaction_id}?response_code=${code}`);
	}
	getWalletResponse (transaction_id: string) : Observable<PresentationsResponse> {
		return this.httpService.get(`ui/presentations/${transaction_id}`);
	}

	generateCode (requestCode: string): Observable<PresentationDefinitionResponse> {
		  return new Observable((subscriber) => {
			if (requestCode && isJSON(requestCode)) {
				const payload = JSON.parse(requestCode);
				if (!this.deviceDetectorService.isDesktop()) {
					payload['wallet_response_redirect_uri_template'] = location.origin+'/get-wallet-code?response_code={RESPONSE_CODE}';
				}
				this.httpService.post<PresentationDefinitionResponse, string>('ui/presentations', payload)
					.pipe(
						tap((res) => { this.localStorageService.set(constants.UI_PRESENTATION, JSON.stringify(res));})
					)
					.subscribe((data) => {
						subscriber.next(data);
					});
			} else {
				subscriber.error({error: 'Invalid JSON'});
			}
		});
	}
	getsTransactionEventsLogs (transactionId: string): Observable<EventLog[]> {
		return this.httpService.get(`ui/presentations/${transactionId}/events`)
			.pipe(
				map((data: any) => {
					const events = data.events.map((event: EventLog) => {
						this.getTransactionData(event).forEach((key: string) => {
							const value = event[key as keyof EventLog] ?? {};
							event.data = {
								key: key,
								value,
							};
						});
						return event;
					});
					return events;
				})
			);
	}
	private getTransactionData (event: EventLog): string[] {
		const objKeys = Object.keys(event);
		objKeys.splice(objKeys.indexOf('timestamp'), 1);
		objKeys.splice(objKeys.indexOf('event'), 1);
		objKeys.splice(objKeys.indexOf('actor'), 1);
		return objKeys;
	}
}
