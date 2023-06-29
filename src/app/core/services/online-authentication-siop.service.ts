import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../network/http/http.service';
import { RequestResponseModel } from '../models/RequestResponse.model';

@Injectable()
export class OnlineAuthenticationSIOPService {

	constructor (
    private readonly httpService: HttpService
	) { }

	initTransaction (): Observable<RequestResponseModel | any> {
		const dataRequest = {
			'type': 'id_token',
			'id_token_type': 'subject_signed_id_token',
			'nonce': 'nonce'
		};
		return this.httpService.post('ui/presentations', dataRequest);
	}
}
