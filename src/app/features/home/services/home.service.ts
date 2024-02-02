import { Injectable } from '@angular/core';
import { MenuOption } from '../models/menu-option';

@Injectable()
export class HomeService {

	options: MenuOption[] = [
  //   {
	// 	key: 'SIOP',
	// 	value: 'Online Authentication  (SIOP)',
	// 	isDisabled: false,
	// },
	{
		key: 'OID4VP_CBOR_Selectable',
		value: 'OID4VP + CBOR selectable',
		isDisabled: false,
	},
	{
		key: 'OID4VP_CBOR',
		value: 'OID4VP + CBOR',
		isDisabled: false,
	},
	{
		key: 'OID4VP_C',
		value: 'OID4VP Custom',
		isDisabled: false,
	}
	];
}
