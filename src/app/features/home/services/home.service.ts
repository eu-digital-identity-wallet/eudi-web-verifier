import { Injectable } from '@angular/core';
import { MenuOption } from '../models/menu-option';

@Injectable()
export class HomeService {

	optionsPIDAuthentication: MenuOption[] = [
		{
			key: 'OID4VP_CBOR_Selectable',
			value: 'Request to share specific attributes from PID',
			isDisabled: false,
		},
		{
			key: 'OID4VP_CBOR',
			value: 'Request for the entire PID',
			isDisabled: false,
		}
	];
	optionsAgeVerification: MenuOption[] = [
		{
			key: 'OID4VP_attestation',
			value: 'Age over 18 (age attestation)',
			isDisabled: false,
		},
		{
			key: 'OID4VP_age_over_18',
			value: 'Age over 18 (PID)',
			isDisabled: false,
		}
	];
	optionsCustomRequest: MenuOption[] = [
		{
			key: 'OID4VP_C',
			value: 'Custom request (for testing)',
			isDisabled: false,
		}
	];
}
