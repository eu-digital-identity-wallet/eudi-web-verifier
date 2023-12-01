import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { KeyValue } from '@angular/common';

@Injectable()
export class JWTService {

	decode (token: string): Observable<KeyValue<string, string>[]> {
		const decoded: any = jwtDecode(token);
		const result: KeyValue<string, string>[] = [];
		Object.keys(decoded).forEach((item) => {
			result.push({key: item.replaceAll('_', ' '), value: String(decoded[item])});
		});
		return of(result);
	}
}
