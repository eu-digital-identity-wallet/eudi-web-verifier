import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from '../network/http/http.service';
import { PresentationDefinitionResponse } from '../models/presentation-definition-response';
import { LocalStorageService } from './local-storage.service';
import * as constants from '@core/constants/constants';
import { DeviceDetectorService } from './device-detector.service';
import { uuidv4 } from '../utils/uuid';
import { AGE_ATTESTATION_OVER_18_PD } from '../data/age_attestation_pd';
import { MsoMdocPresentationService } from "@app/core/services/mso-mdoc-presentation.service";
import { PID_MSO_MDOC } from '@core/data/pid_msoMdoc';
import { MDL_MSO_MDOC } from "@core/data/mdl_msoMdoc";

@Injectable()
export class OnlineAuthenticationSIOPService {

	constructor (
    private readonly httpService: HttpService,
    private readonly localStorageService: LocalStorageService,
    private readonly deviceDetectorService: DeviceDetectorService,
    private readonly msoMdocPresentationService: MsoMdocPresentationService
	) { }

	initPIDPresentationTransaction(presentationPurpose: string): Observable<PresentationDefinitionResponse> {
    let PID_FULL_PD = this.msoMdocPresentationService.presentationOf(PID_MSO_MDOC, presentationPurpose)
    const payload: any = {...PID_FULL_PD};
		payload.nonce = uuidv4();
		if (!this.deviceDetectorService.isDesktop()) {
			payload['wallet_response_redirect_uri_template'] = location.origin+'/get-wallet-code?response_code={RESPONSE_CODE}';
		}
		return this.httpService.post<PresentationDefinitionResponse, any>('ui/presentations', payload)
			.pipe(
				tap((res) => { this.localStorageService.set(constants.UI_PRESENTATION, JSON.stringify(res));})
			);
	}
	initPIDAgeOver18PresentationTransaction (presentationPurpose: string): Observable<PresentationDefinitionResponse> {
    let PID_AGE_OVER_18_PD = this.msoMdocPresentationService.presentationOf(PID_MSO_MDOC, presentationPurpose, ["age_over_18"])
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

	initAgeOver18AttestationPresentationTransaction (): Observable<PresentationDefinitionResponse> {
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

	initMDLPresentationTransaction(presentationPurpose: string): Observable<PresentationDefinitionResponse> {
    let MDL_FULL_PD = this.msoMdocPresentationService.presentationOf(MDL_MSO_MDOC, presentationPurpose)
    const payload: any = {...MDL_FULL_PD};
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
