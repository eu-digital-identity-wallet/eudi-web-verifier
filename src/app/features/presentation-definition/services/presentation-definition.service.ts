import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/network/http/http.service';
import { Observable, map } from 'rxjs';
import { JWT } from '../models/jwt';

@Injectable()
export class PresentationDefinitionService {

	constructor (private readonly httpService: HttpService) { }

	requestCredentialByJWT (request_uri: string): Observable<JWT> {
		return this.httpService.get<JWT>(request_uri);
	}

}
