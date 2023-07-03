import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/network/http/http.service';
import { Observable } from 'rxjs';
import { isJSON } from '../utils/ValidationJSON';
import { PresentationDefinitionResponse } from '../models/presentation-definition-response';

@Injectable()
export class PresentationDefinitionService {

	constructor (private readonly httpService: HttpService) { }

	getWalletResponse (presentation_id: string, nonce: string) : Observable<string> {
		return this.httpService.get(`ui/presentations/${presentation_id}?nonce=${nonce}`);
	}

	generateCode (requestCode: string): Observable<PresentationDefinitionResponse> {
		  return new Observable((subscriber) => {
			if (requestCode && isJSON(requestCode)) {
				const payload = JSON.parse(requestCode);
				this.httpService.post<PresentationDefinitionResponse, string>('ui/presentations', payload)
					.subscribe((data) => {
						subscriber.next(data);
					});
			} else {
				subscriber.error({error: 'Invalid JSON'});
			}
		});
	}
}
