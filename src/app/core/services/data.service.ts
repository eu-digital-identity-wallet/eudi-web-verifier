import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PresentationDefinitionResponse } from '../models/presentation-definition-response';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	presentationDefinitionRequest$: Subject<string> = new Subject();

	private dataQR: PresentationDefinitionResponse | null = null;
	get QRCode () {
		return this.dataQR;
	}
	setQRCode (code: PresentationDefinitionResponse | null) {
		this.dataQR = code;
	}
}
