import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/network/http/http.service';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { IRequestOptions } from '@app/core/network/models/request.model';
import jwt_decode from 'jwt-decode';
import { JWT } from '../models/JWT';

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

	replacePortIfIsLocal (request_uri: string): string {
		return request_uri.replace('http://localhost:8080', environment.apiUrl);
	}
}
