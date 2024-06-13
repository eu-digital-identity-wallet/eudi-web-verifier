import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from '../network/http/http.service';
import { PresentationDefinitionResponse } from '../models/presentation-definition-response';
import { PID_PRESENTATION_DEFINITION } from '../data/pid_presentation_definition';
import { LocalStorageService } from './local-storage.service';
import * as constants from '@core/constants/constants';
import { DeviceDetectorService } from './device-detector.service';
import { uuidv4 } from '../utils/uuid';
import { PID_AGE_OVER_18_PD } from '../data/pid_age_over_18_pd';
import { AGE_ATTESTATION_OVER_18_PD } from '../data/age_attestation_pd';

@Injectable()
export class OnlineAuthenticationSIOPService {

	constructor (
    private readonly httpService: HttpService,
    private readonly localStorageService: LocalStorageService,
    private readonly deviceDetectorService: DeviceDetectorService
	) { }

	initTransaction (): Observable<PresentationDefinitionResponse> {
		const dataRequest: any = {
			'type': 'id_token',
			'id_token_type': 'subject_signed_id_token',
			'nonce': uuidv4()
		};
		if (!this.deviceDetectorService.isDesktop()) {
			dataRequest['wallet_response_redirect_uri_template'] = location.origin+'/get-wallet-code/?response_code={RESPONSE_CODE}';
		}
		return this.httpService.post<PresentationDefinitionResponse, {type: string, 'id_token_type': string, 'nonce': string}>
		('ui/presentations', dataRequest)
			.pipe(
				tap((res) => { this.localStorageService.set(constants.UI_PRESENTATION, JSON.stringify(res));})
			);
	}
	initCborTransaction (): Observable<PresentationDefinitionResponse> {
		const payload: any = {...PID_PRESENTATION_DEFINITION};
		payload.nonce = uuidv4();
		if (!this.deviceDetectorService.isDesktop()) {
			payload['wallet_response_redirect_uri_template'] = location.origin+'/get-wallet-code?response_code={RESPONSE_CODE}';
		}
		return this.httpService.post<PresentationDefinitionResponse, any>('ui/presentations', payload)
			.pipe(
				tap((res) => { this.localStorageService.set(constants.UI_PRESENTATION, JSON.stringify(res));})
			);
	}
	initAgeOver18Transaction (): Observable<PresentationDefinitionResponse> {
		const payload: any = {...PID_AGE_OVER_18_PD};
		payload.nonce = uuidv4();
		if (!this.deviceDetectorService.isDesktop()) {
			payload['wallet_response_redirect_uri_template'] = location.origin+'/get-wallet-code?response_code={RESPONSE_CODE}';
		}
		return this.httpService.post<PresentationDefinitionResponse, any>('ui/presentations', payload)
			.pipe(
				tap((res) => { this.localStorageService.set(constants.UI_PRESENTATION, JSON.stringify(res));})
			);
	}
	initAgeOver18AttestationTransaction (): Observable<PresentationDefinitionResponse> {
		const payload: any = {...AGE_ATTESTATION_OVER_18_PD};
		payload.nonce = uuidv4();
		if (!this.deviceDetectorService.isDesktop()) {
			payload['wallet_response_redirect_uri_template'] = location.origin+'/get-wallet-code?response_code={RESPONSE_CODE}';
		}
		return this.httpService.post<PresentationDefinitionResponse, any>('ui/presentations', payload)
			.pipe(
				tap((res) => { this.localStorageService.set(constants.UI_PRESENTATION, JSON.stringify(res));})
			);
	}
}
