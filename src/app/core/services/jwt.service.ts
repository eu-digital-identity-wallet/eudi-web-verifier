import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { KeyValue } from '@angular/common';

@Injectable()
export class JWTService {

	decodedTest = {
		'sub': '1234567890',
		'name': 'John Doe',
		'iat': 1516239022
	};
	decode (token: string): Observable<KeyValue<string, string>[]> {
		const decoded: any = jwtDecode(token);
		console.log(decoded);
		const result: KeyValue<string, string>[] = [];
		Object.keys(decoded).forEach((item) => {
			result.push({key: item, value: decoded[item]});
		});
		return of(result);
	}
}
