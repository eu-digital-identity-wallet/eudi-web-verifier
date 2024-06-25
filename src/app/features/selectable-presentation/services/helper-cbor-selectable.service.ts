import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class HelperCborSelectableService {

	goNextStep$: Subject<string> = new Subject();
}
