import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  customRequest$: Subject<CustomRequest> = new Subject();
}
export interface CustomRequest {
  requestObjectJson: string,
  channel: 'dc-api' | 'redirects'
}