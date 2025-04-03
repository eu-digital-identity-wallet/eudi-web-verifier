import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { KeyValue } from '@angular/common';

@Injectable()
export class JWTService {

  decodeToObservable (token: string): Observable<KeyValue<string, string>[]> {
    return of(
      this.decodeToKeyValues(token)
    );
  }

  decodeToKeyValues (token: string): KeyValue<string, string>[] {
    const decoded: any = jwtDecode(token);
    const result: KeyValue<string, string>[] = [];
    Object.keys(decoded).forEach((item) => {
      result.push({
        key: item.replaceAll('_', ' '),
        value: String(decoded[item])
      });
    });
    return result;
  }

  decodeToObject(token: string): Object {
    return jwtDecode(token);
  }

}
