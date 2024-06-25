import { Injectable } from '@angular/core';
import { MenuOption } from '../models/menu-option';

@Injectable()
export class HomeService {

	optionsPIDAuthentication: MenuOption[] = [
		{
			key: 'PID_Selectable',
			value: 'Request to share specific attributes from PID',
			isDisabled: false,
		},
		{
			key: 'PID_full',
			value: 'Request for the entire PID',
			isDisabled: false,
		}
	];
  optionsMDLAuthentication: MenuOption[] = [
		{
			key: 'MDL_Selectable',
			value: 'Request to share specific attributes from mDL',
			isDisabled: false,
		},
		{
			key: 'MDL_Full',
			value: 'Request for the entire mDL',
			isDisabled: false,
		}
	];
	optionsAgeVerification: MenuOption[] = [
		{
			key: 'AgeOver18_attestation',
			value: 'Age over 18 (age attestation)',
			isDisabled: false,
		},
		{
			key: 'AgeOver18_pid',
			value: 'Age over 18 (PID)',
			isDisabled: false,
		}
	];
	optionsCustomRequest: MenuOption[] = [
		{
			key: 'PD_Custom_Request',
			value: 'Custom request (for testing)',
			isDisabled: false,
		}
	];
}
