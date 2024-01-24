import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/network/http/http.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isJSON } from '../utils/ValidationJSON';
import { PresentationDefinitionResponse } from '../models/presentation-definition-response';
import { PresentationsResponse } from '../models/presentations-response';
import { LocalStorageService } from './local-storage.service';
import * as constants from '@core/constants/constants';
import { DeviceDetectorService } from './device-detector.service';
import { environment } from '@environments/environment';
import { uuidv4 } from '../utils/uuid';

@Injectable()
export class PresentationDefinitionService {

	constructor (
    private readonly httpService: HttpService,
    private readonly localStorageService: LocalStorageService,
    private readonly deviceDetectorService: DeviceDetectorService
	) { }

	getWalletResponse (presentation_id: string, nonce: string) : Observable<PresentationsResponse> {
		return this.httpService.get(`ui/presentations/${presentation_id}?nonce=${nonce}`);
	}

	generateCode (requestCode: string): Observable<PresentationDefinitionResponse> {
		  return new Observable((subscriber) => {
			if (requestCode && isJSON(requestCode)) {
				const payload = JSON.parse(requestCode);
				if (!this.deviceDetectorService.isDesktop()) {
					payload['wallet_response_redirect_uri_template'] = environment.apiUrl+'/home/get-wallet-code?response_code='+uuidv4();
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
}
