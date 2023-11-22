import { CBORField } from '../models/CBORFields';

export const 	CBORFields: CBORField[] = [
	// {
	// 	id: 0,
	// 	label: 'Document Type',
	// 	path: '$.mdoc.doctype',
	// 	value: {
	// 		path: [
	// 			'$.mdoc.doctype'
	// 		],
	// 		'filter': {
	// 			'type': 'string',
	// 			'const': 'eu.europa.ec.eudiw.pid.1'
	// 		}
	// 	}
	// },
	// {
	// 	id: 1,
	// 	label: 'Name Space',
	// 	path: '$.mdoc.namespace',
	// 	value: {
	// 		path: [
	// 			'$.mdoc.namespace'
	// 		],
	// 		'filter': {
	// 			'type': 'string',
	// 			'const': 'eu.europa.ec.eudiw.pid.1'
	// 		}
	// 	}
	// },
	{
		id: 2,
		label: 'Family Name',
		path: '$.mdoc.family_name',
		value: {
			path: [
				'$.mdoc.family_name'
			],
			intent_to_retain: false
		},
	},
	{
		id: 3,
		label: 'Given Name',
		path: '$.mdoc.given_name',
		value: {
			path: [
				'$.mdoc.given_name'
			],
			intent_to_retain: false
		}
	},
	{
		id: 4,
		label: 'Birthdate',
		path: '$.mdoc.birth_date',
		value: {
			path: [
				'$.mdoc.birth_date'
			],
			intent_to_retain: false
		}
	},
	{
		id: 5,
		label: 'Age over 18',
		path: '$.mdoc.age_over_18',
		value: {
			path: [
				'$.mdoc.age_over_18'
			],
			intent_to_retain: false
		}
	},
	{
		id: 6,
		label: 'Age in years',
		path: '$.mdoc.age_in_years',
		value: {
			path: [
				'$.mdoc.age_in_years'
			],
			intent_to_retain: false
		}
	},
	{
		id: 6,
		label: 'Age birth years',
		path: '$.mdoc.age_birth_year',
		value: {
			path: [
				'$.mdoc.age_birth_year'
			],
			intent_to_retain: false
		}
	},
	{
		id: 8,
		label: 'Family name birth',
		path: '$.mdoc.family_name_birth',
		value: {
			path: [
				'$.mdoc.family_name_birth'
			],
			intent_to_retain: false
		}
	},
	{
		id: 9,
		label: 'Given name birth',
		path: '$.mdoc.given_name_birth',
		value: {
			path: [
				'$.mdoc.given_name_birth'
			],
			intent_to_retain: false
		}
	},
	{
		id: 10,
		label: 'Birth place',
		path: '$.mdoc.birth_place',
		value: {
			path: [
				'$.mdoc.birth_place'
			],
			intent_to_retain: false
		}
	},
	{
		id: 11,
		label: 'Birth place',
		path: '$.mdoc.birth_place',
		value: {
			path: [
				'$.mdoc.birth_place'
			],
			intent_to_retain: false
		}
	},
	{
		id: 12,
		label: 'Birth country',
		path: '$.mdoc.birth_country',
		value: {
			path: [
				'$.mdoc.birth_country'
			],
			intent_to_retain: false
		}
	},
	{
		id: 13,
		label: 'Birth state',
		path: '$.mdoc.birth_state',
		value: {
			path: [
				'$.mdoc.birth_state'
			],
			intent_to_retain: false
		}
	},
	{
		id: 14,
		label: 'Birth city',
		path: '$.mdoc.birth_city',
		value: {
			path: [
				'$.mdoc.birth_city'
			],
			intent_to_retain: false
		}
	},
	{
		id: 15,
		label: 'Resident address',
		path: '$.mdoc.resident_address',
		value: {
			path: [
				'$.mdoc.resident_address'
			],
			intent_to_retain: false
		}
	},
	{
		id: 15,
		label: 'Resident country',
		path: '$.mdoc.resident_country',
		value: {
			path: [
				'$.mdoc.resident_country'
			],
			intent_to_retain: false
		}
	},
	{
		id: 16,
		label: 'Resident state',
		path: '$.mdoc.resident_state',
		value: {
			path: [
				'$.mdoc.resident_state'
			],
			intent_to_retain: false
		}
	},
	{
		id: 17,
		label: 'Resident city',
		path: '$.mdoc.resident_city',
		value: {
			path: [
				'$.mdoc.resident_city'
			],
			intent_to_retain: false
		}
	},
	{
		id: 18,
		label: 'Resident postal code',
		path: '$.mdoc.resident_postal_code',
		value: {
			path: [
				'$.mdoc.resident_postal_code'
			],
			intent_to_retain: false
		}
	},
	{
		id: 19,
		label: 'Resident street',
		path: '$.mdoc.resident_street',
		value: {
			path: [
				'$.mdoc.resident_street'
			],
			intent_to_retain: false
		}
	},
	{
		id: 20,
		label: 'Resident house number',
		path: '$.mdoc.resident_house_number',
		value: {
			path: [
				'$.mdoc.resident_house_number'
			],
			intent_to_retain: false
		}
	},
	{
		id: 21,
		label: 'Gender',
		path: '$.mdoc.gender',
		value: {
			path: [
				'$.mdoc.gender'
			],
			intent_to_retain: false
		}
	},
	{
		id: 22,
		label: 'Nationality',
		path: '$.mdoc.nationality',
		value: {
			path: [
				'$.mdoc.nationality'
			],
			intent_to_retain: false
		}
	},
	{
		id: 23,
		label: 'Issuance date',
		path: '$.mdoc.issuance_date',
		value: {
			path: [
				'$.mdoc.issuance_date'
			],
			intent_to_retain: false
		}
	},
	{
		id: 24,
		label: 'Expiry date',
		path: '$.mdoc.expiry_date',
		value: {
			path: [
				'$.mdoc.expiry_date'
			],
			intent_to_retain: false
		}
	},
	{
		id: 25,
		label: 'Issuing authority',
		path: '$.mdoc.issuing_authority',
		value: {
			path: [
				'$.mdoc.issuing_authority'
			],
			intent_to_retain: false
		}
	},
	{
		id: 26,
		label: 'Document number',
		path: '$.mdoc.document_number',
		value: {
			path: [
				'$.mdoc.document_number'
			],
			intent_to_retain: false
		}
	},
	{
		id: 27,
		label: 'Administrative number',
		path: '$.mdoc.administrative_number',
		value: {
			path: [
				'$.mdoc.administrative_number'
			],
			intent_to_retain: false
		}
	},
	{
		id: 28,
		label: 'Issuing country',
		path: '$.mdoc.issuing_country',
		value: {
			path: [
				'$.mdoc.issuing_country'
			],
			intent_to_retain: false
		}
	},
	{
		id: 29,
		label: 'Issuing jurisdiction',
		path: '$.mdoc.issuing_jurisdiction',
		value: {
			path: [
				'$.mdoc.issuing_jurisdiction'
			],
			intent_to_retain: false
		}
	},
];
