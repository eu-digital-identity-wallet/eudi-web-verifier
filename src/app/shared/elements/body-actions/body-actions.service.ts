import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Modification } from './models/modification';

@Injectable()
export class BodyActionsService {
	handelButton$: Subject<Modification> = new Subject();
}
