import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/network/http/http.service';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { IRequestOptions } from '@app/core/network/models/request.model';
import jwt_decode from 'jwt-decode';
import { JWT } from '../../features/presentation-definition/models/JWT';
import { HttpHeaders } from '@angular/common/http';
import { generateJWT } from '../utils/GenerateJWT';

@Injectable()
export class PresentationDefinitionService {

	constructor (private readonly httpService: HttpService) { }

	requestCredentialByJWT (request_uri: string): Observable<JWT> {
		const options: IRequestOptions = {
			responseType: 'text'
		};
		return this.httpService.getStandalone<JWT>(this.replacePortIfIsLocal(request_uri), options).
			pipe(
				map((token: string) => jwt_decode(token))
			);
	}

	submitWalletResponse (state: string): Observable<any> {
		const options: IRequestOptions = {
			headers: new HttpHeaders(
				{'Content-Type': 'application/x-www-form-urlencoded'}
			),
			responseType: 'text'
		};
		const body = new URLSearchParams();
		const jwtToken = generateJWT(state);
		body.set('response', jwtToken);
		return this.httpService.post('wallet/direct_post', body, options);
	}

	getWalletResponse (presentation_id: string, nonce: string) : Observable<any> {
		return this.httpService.get(`ui/presentations/${presentation_id}?nonce=${nonce}`);
	}

	private replacePortIfIsLocal (request_uri: string): string {
		return request_uri.replace('http://localhost:8080', environment.apiUrl);
	}

}
