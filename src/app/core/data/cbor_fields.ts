/* eslint-disable quotes */
import { CBORField } from '../models/CBORFields';

export const 	CBORFields: CBORField[] = [
	{
		id: 1,
		label: 'Family Name',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['family_name']"
			],
			intent_to_retain: false
		},
	},
	{
		id: 2,
		label: 'Given Name',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['given_name']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 3,
		label: 'Birthdate',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['birth_date']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 4,
		label: 'Age over 18',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['age_over_18']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 5,
		label: 'Age in years',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['age_in_years']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 6,
		label: 'Age birth years',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['age_birth_year']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 7,
		label: 'Family name birth',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['family_name_birth']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 8,
		label: 'Given name birth',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['given_name_birth']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 9,
		label: 'Birth place',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['birth_place']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 10,
		label: 'Birth country',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['birth_country']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 11,
		label: 'Birth state',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['birth_state']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 12,
		label: 'Birth city',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['birth_city']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 13,
		label: 'Resident address',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['resident_address']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 14,
		label: 'Resident country',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['resident_country']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 15,
		label: 'Resident state',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['resident_state']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 16,
		label: 'Resident city',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['resident_city']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 17,
		label: 'Resident postal code',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['resident_postal_code']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 18,
		label: 'Resident street',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['resident_street']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 19,
		label: 'Resident house number',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['resident_house_number']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 20,
		label: 'Gender',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['gender']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 21,
		label: 'Nationality',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['nationality']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 22,
		label: 'Issuance date',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['issuance_date']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 23,
		label: 'Expiry date',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['expiry_date']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 24,
		label: 'Issuing authority',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['issuing_authority']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 25,
		label: 'Document number',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['document_number']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 26,
		label: 'Administrative number',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['administrative_number']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 27,
		label: 'Issuing country',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['issuing_country']"
			],
			intent_to_retain: false
		}
	},
	{
		id: 28,
		label: 'Issuing jurisdiction',
		value: {
			path: [
				"$['eu.europa.ec.eudi.pid.1']['issuing_jurisdiction']"
			],
			intent_to_retain: false
		}
	},
];
