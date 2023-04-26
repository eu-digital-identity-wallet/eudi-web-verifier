import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface IRequestParams <T> {
    url: string;
    body?: T;
    options?: IRequestOptions;
}

export interface IRequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    observe?: 'body' | 'events' | 'response';
    params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
    reportProgress?: boolean;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
    withCredentials?: boolean;
}
