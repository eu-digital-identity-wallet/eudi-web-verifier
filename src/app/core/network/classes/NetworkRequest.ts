import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { IRequestParams } from '../models/request.model';

export class NetworkRequest {
	http: HttpClient;
	constructor (http: HttpClient) {
		this.http = http;
	}
	protected GET<T> (params: IRequestParams<T>): Observable<T> {
		return this.http.get<T> (params.url).pipe(
			this.error()
		);
	}

	protected POST<T> (params: IRequestParams<T>): Observable<T> {
		return this.http.post<T> (params.url, params.body).pipe(
			this.error()
		);
	}

	protected PUT<T> (params: IRequestParams<T>): Observable<T | ArrayBuffer> {
		return this.http.put<T> (params.url, params.body).pipe(
			this.error()
		);
	}
	protected PATCH<T> (params: IRequestParams<T>): Observable<T | ArrayBuffer> {
		return this.http.patch<T> (params.url, params.body).pipe(
			this.error()
		);
	}
	protected DELETE<T> (params: IRequestParams<T>): Observable<T | ArrayBuffer> {
		return this.http.delete<T> (params.url).pipe(
			this.error()
		);
	}

	private readonly error = <T, R> () => (
		take <T> (1),
		catchError <T, Observable<R>> ((error: HttpErrorResponse) => {
			this.handleError(error);
			return throwError(() => error);
		})
	);

	private handleError (error: HttpErrorResponse): void {
		console.log('Error', error?.message || 'Something Bad Happened');
	}
}
