import { ActionCode } from '@app/shared/elements/body-actions/models/ActionCode';
import { BodyAction } from '@app/shared/elements/body-actions/models/BodyAction';

export const HOME_ACTIONS: BodyAction[] = [
	{
		label: 'Next',
		id: 'next_button',
		disabled: true,
		mode: 'none',
		color: 'primary',
		order: 1,
		code: ActionCode.NEXT
	}
];
export const PRESENTATION_ACTIONS: BodyAction[] = [
	{
		label: 'Next',
		id: 'next_button',
		disabled: true,
		mode: 'none',
		color: 'primary',
		order: 1,
		code: ActionCode.NEXT
	},
	{
		label: 'Back',
		id: 'back_button',
		disabled: false,
		mode: 'none',
		color: 'secondary',
		order: 2,
		code: ActionCode.BACK
	},
];
