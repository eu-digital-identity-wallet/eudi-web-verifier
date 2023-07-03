import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { NetworkRequest } from '../classes/NetworkRequest';
import { IRequestOptions } from '../models/request.model';

@Injectable({
	providedIn: 'root'
})
export class HttpService extends NetworkRequest {

	private apiUrl: string = environment.apiUrl;

	constructor (
        override readonly http: HttpClient,
	) {
		super(http);
	}

	public get <T> (endpoint: string, options?: IRequestOptions): Observable<T> {
		return this.GET ({ url: this.getUrl(endpoint), options: options });
	}

	public post <T, K> (endpoint: string, body: K, options?: IRequestOptions): Observable<T> {
		return this.POST<T, K>({ url: this.getUrl(endpoint), body, options });
	}

	public put <T> (endpoint: string, body: T, options?: IRequestOptions): Observable<T | ArrayBuffer> {
		return this.PUT({ url: this.getUrl(endpoint), body: body, options: options });
	}

	public patch <T> (endpoint: string, body: T, options?: IRequestOptions): Observable<T | ArrayBuffer> {
		return this.PATCH({ url: this.getUrl(endpoint), body: body, options: options });
	}

	public delete <T> (endpoint: string, options?: IRequestOptions): Observable<T | ArrayBuffer> {
		return this.DELETE({ url: this.getUrl(endpoint), options: options });
	}

	private getUrl (endpoint: string): string {
		return `${this.apiUrl}/${endpoint}`;
	}
}
