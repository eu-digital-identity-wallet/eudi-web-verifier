import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { CBORFields } from '@app/core/data/cbor_fields';

@Injectable()
export class CreateFormService {

	form = new FormGroup({
		fields: new FormArray([])
	});
	constructor () {
		CBORFields.forEach(() => this.items.push(new FormControl()));
	}
	get items (): FormArray {
		return this.form.get('fields') as FormArray;
	}
}
