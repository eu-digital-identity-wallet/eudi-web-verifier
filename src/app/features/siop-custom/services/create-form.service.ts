import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Injectable()
export class CreateFormService {

	fields = [
		{
			id: 0,
			label: 'Document Type',
			path: '$.mdoc.doctype',
			value: {
				'path': [
					'$.mdoc.doctype'
				],
				'filter': {
					'type': 'string',
					'const': 'eu.europa.ec.eudiw.pid.1'
				}
			}
		},
		{
			id: 1,
			label: 'Name Space',
			path: '$.mdoc.namespace',
			value: {
				'path': [
					'$.mdoc.namespace'
				],
				'filter': {
					'type': 'string',
					'const': 'eu.europa.ec.eudiw.pid.1'
				}
			}
		},
		{
			id: 2,
			label: 'Family Name',
			path: '$.mdoc.family_name',
			value: {
				'path': [
					'$.mdoc.family_name'
				],
				'intent_to_retain': false
			},
		},
		{
			id: 3,
			label: 'Given Name',
			path: '$.mdoc.given_name',
			value: {
				'path': [
					'$.mdoc.given_name'
				],
				'intent_to_retain': false
			}
		},
		{
			id: 4,
			label: 'Birthdate',
			path: '$.mdoc.birth_date',
			value: {
				'path': [
					'$.mdoc.birth_date'
				],
				'intent_to_retain': false
			}
		},
		{
			id: 5,
			label: 'Age over 18',
			path: '$.mdoc.age_over_18',
			value: {
				'path': [
					'$.mdoc.age_over_18'
				],
				'intent_to_retain': false
			}
		},
	];
	form = new FormGroup({
		fields: new FormArray([])
	});
	constructor () {
		this.fields.forEach(() => this.items.push(new FormControl()));
	}
	get items (): FormArray {
		return this.form.get('fields') as FormArray;
	}
}
