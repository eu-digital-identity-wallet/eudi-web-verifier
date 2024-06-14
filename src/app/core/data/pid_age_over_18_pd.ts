import { Presentation } from '@app/features/siop-custom/models/Presentation';

/* eslint-disable quotes */
export const PID_AGE_OVER_18_PD: Presentation = {
	'type': 'vp_token',
	'presentation_definition': {
		'id': '32f54163-7166-48f1-93d8-ff217bdb0653',
		'input_descriptors': [
			{
				'id': 'eu.europa.ec.eudi.pid.1',
				'name': 'EUDI PID',
				'purpose': 'We need to verify you are over 18 using your PID',
				'format': {
					'mso_mdoc': {
						'alg': [
							"ES256",
							"ES384",
							"ES512"
						]
					}
				},
				'constraints': {
					'fields': [
					  {
							'path': [
								"$['eu.europa.ec.eudi.pid.1']['age_over_18']"
							],
							'intent_to_retain': false
						}
					]
				}
			}
		]
	},
	'nonce' : ''
};
