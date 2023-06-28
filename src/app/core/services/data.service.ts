import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	presentationDefinitionRequest$: Subject<any> = new Subject();

	private dataQR!: {client_id: string, request_uri: string, presentation_id: string };
	get QRCode () {
		return this.dataQR;
	}
	setQRCode (code: any) {
		this.dataQR = code;
	}
}
