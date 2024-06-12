import { Presentation } from '@app/features/siop-custom/models/Presentation';

/* eslint-disable quotes */
export const AGE_ATTESTATION_OVER_18_PD: Presentation = {
	'type': 'vp_token',
	'presentation_definition': {
		'id': '32f54163-7166-48f1-93d8-ff217bdb0653',
		'input_descriptors': [
			{
				'id': 'eu.europa.ec.eudiw.pseudonym.age_over_18.1',
				'name': 'Age attestation',
				'purpose': 'We need to verify you are over 18',
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
								"$['eu.europa.ec.eudiw.pseudonym.age_over_18.1']['age_over_18']"
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
