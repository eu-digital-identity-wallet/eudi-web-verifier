import { VctVariant } from '@core/models/attestation/Attestations';

export type CrossBorderPidMemberState = {
  code: string;
  name: string;
  vct: string;
};

export const crossBorderPidVct = (code: string): string =>
	`urn:eudi:pid:${code.toLowerCase()}:1`;

export const PID_GENERIC_VCT = 'urn:eudi:pid:1';

const memberState = (code: string, name: string): CrossBorderPidMemberState => ({
	code,
	name,
	vct: crossBorderPidVct(code),
});

export const EU_PID_CROSS_BORDER_MEMBER_STATES: CrossBorderPidMemberState[] = [
	memberState('AT', 'Austria'),
	memberState('BE', 'Belgium'),
	memberState('BG', 'Bulgaria'),
	memberState('HR', 'Croatia'),
	memberState('CY', 'Cyprus'),
	memberState('CZ', 'Czechia'),
	memberState('DK', 'Denmark'),
	memberState('EE', 'Estonia'),
	memberState('FI', 'Finland'),
	memberState('FR', 'France'),
	memberState('DE', 'Germany'),
	memberState('GR', 'Greece'),
	memberState('HU', 'Hungary'),
	memberState('IE', 'Ireland'),
	memberState('IT', 'Italy'),
	memberState('LV', 'Latvia'),
	memberState('LT', 'Lithuania'),
	memberState('LU', 'Luxembourg'),
	memberState('MT', 'Malta'),
	memberState('NL', 'Netherlands'),
	memberState('PL', 'Poland'),
	memberState('PT', 'Portugal'),
	memberState('RO', 'Romania'),
	memberState('SK', 'Slovakia'),
	memberState('SI', 'Slovenia'),
	memberState('ES', 'Spain'),
	memberState('SE', 'Sweden'),
];

export const PID_CROSS_BORDER_VCT_VARIANTS: VctVariant[] = [
	...EU_PID_CROSS_BORDER_MEMBER_STATES.map((state) => ({
		id: `pid_cross_border_${state.code}`,
		vct: state.vct,
	})),
	{ id: 'pid_cross_border_generic', vct: PID_GENERIC_VCT },
];
