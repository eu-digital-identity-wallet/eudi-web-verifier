import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/network/http/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class PresentationDefinitionService {

	constructor (private readonly httpService: HttpService) { }

	getWalletResponse (presentation_id: string, nonce: string) : Observable<string> {
		return this.httpService.get(`ui/presentations/${presentation_id}?nonce=${nonce}`);
	}
}
