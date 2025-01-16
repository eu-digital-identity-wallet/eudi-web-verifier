import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	presentationDefinitionRequest$: Subject<string> = new Subject();

}
