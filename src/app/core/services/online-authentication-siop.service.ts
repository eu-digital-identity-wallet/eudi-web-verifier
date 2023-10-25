import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../network/http/http.service';
import { PresentationDefinitionResponse } from '../models/presentation-definition-response';
import { PID_PRESENTATION_DEFINITION } from '../data/pid_presentation_definition';

@Injectable()
export class OnlineAuthenticationSIOPService {

	constructor (
    private readonly httpService: HttpService
	) { }

	initTransaction (): Observable<PresentationDefinitionResponse> {
		const dataRequest = {
			'type': 'id_token',
			'id_token_type': 'subject_signed_id_token',
			'nonce': 'nonce'
		};
		return this.httpService.post<PresentationDefinitionResponse, {type: string, 'id_token_type': string, 'nonce': string}>
		('ui/presentations', dataRequest,);
	}
	initCborTransaction (): Observable<PresentationDefinitionResponse> {
		// const dataRequest = {
		// 	'type': 'id_token',
		// 	'id_token_type': 'subject_signed_id_token',
		// 	'nonce': 'nonce'
		// };
		return this.httpService.post('ui/presentations', PID_PRESENTATION_DEFINITION);
	}
}
