import {Attestation, MsoMdocAttestation, SdJwtVcAttestation} from "@core/models/attestation/Attestations";
import {AGE_OVER_18_ATTESTATION, EHIC_ATTESTATION, EHIC_ATTESTATION_DC4EU, MDL_ATTESTATION, PDA1_ATTESTATION, PHOTO_ID_ATTESTATION, PID_ATTESTATION} from "@core/constants/attestation-definitions";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {AttestationType} from "@core/models/attestation/AttestationType";
import {DataElement} from "@core/models/attestation/AttestationDefinition";
import { ClaimsQuery } from "../models/dcql/DCQL";

export const SUPPORTED_FORMATS: AttestationFormat[] = [
  AttestationFormat.MSO_MDOC,
  AttestationFormat.SD_JWT_VC
]

/*---- MDL ATTESTATION INSTANCES PER FORMAT ----*/
export const MDL_MSO_MDOC: MsoMdocAttestation = {
  format: AttestationFormat.MSO_MDOC,
  attestationDef: MDL_ATTESTATION,
  doctype: 'org.iso.18013.5.1.mDL',
  namespace: 'org.iso.18013.5.1',
  claimQuery: (attribute: DataElement) => { return msoMdocClaimQuery('org.iso.18013.5.1', attribute.identifier) }
}

/*---- PID ATTESTATION INSTANCES PER FORMAT ----*/
export const PID_MSO_MDOC: MsoMdocAttestation = {
  format: AttestationFormat.MSO_MDOC,
  attestationDef: PID_ATTESTATION,
  doctype: 'eu.europa.ec.eudi.pid.1',
  namespace: 'eu.europa.ec.eudi.pid.1',
  claimQuery: (attribute: DataElement) => { return msoMdocClaimQuery('eu.europa.ec.eudi.pid.1', attribute.identifier) }
}
export const PID_SD_JWT_VC: SdJwtVcAttestation = {
  format: AttestationFormat.SD_JWT_VC,
  vct: "urn:eudi:pid:1",
  attestationDef: PID_ATTESTATION,
  claimQuery: (attribute: DataElement) => { return { path: sdJwtVcAttributeClaimQuery(attribute, AttestationType.PID) } }
}

/*---- AGE OVER 18 ATTESTATION INSTANCES PER FORMAT ----*/
export const AGE_OVER_18_MSO_MDOC: MsoMdocAttestation = {
  format: AttestationFormat.MSO_MDOC,
  attestationDef: AGE_OVER_18_ATTESTATION,
  doctype: 'eu.europa.ec.eudi.pseudonym.age_over_18.1',
  namespace: 'eu.europa.ec.eudi.pseudonym.age_over_18.1',
  claimQuery: (attribute: DataElement) => { return msoMdocClaimQuery('eu.europa.ec.eudi.pseudonym.age_over_18.1', attribute.identifier) }
}

/*---- PHOTO ID ATTESTATION INSTANCES PER FORMAT ----*/
export const PHOTO_ID_MSO_MDOC: MsoMdocAttestation = {
  format: AttestationFormat.MSO_MDOC,
  attestationDef: PHOTO_ID_ATTESTATION,
  doctype: 'org.iso.23220.2.photoid.1',
  namespace: 'org.iso.23220.photoid.1',
  claimQuery: (attribute: DataElement) => { return msoMdocClaimQuery('org.iso.23220.photoid.1', attribute.identifier) }
}

/*---- EHIC INSTANCES PER FORMAT ----*/
export const EHIC_MSO_MDOC: MsoMdocAttestation = {
  format: AttestationFormat.MSO_MDOC,
  attestationDef: EHIC_ATTESTATION,
  doctype: 'eu.europa.ec.eudi.ehic.1',
  namespace: 'eu.europa.ec.eudi.ehic.1',
  claimQuery: (attribute: DataElement) => { return msoMdocClaimQuery('eu.europa.ec.eudi.ehic.1', attribute.identifier) }
}
export const EHIC_SD_JWT_VC: SdJwtVcAttestation = {
  format: AttestationFormat.SD_JWT_VC,
  attestationDef: EHIC_ATTESTATION,
  vct: 'urn:eu.europa.ec.eudi:ehic:1',
  claimQuery: (attribute: DataElement) => { return { path: sdJwtVcAttributeClaimQuery(attribute, AttestationType.EHIC) } }
}
export const EHIC_SD_JWT_VC_DC4EU: SdJwtVcAttestation = {
  format: AttestationFormat.SD_JWT_VC,
  attestationDef: EHIC_ATTESTATION_DC4EU,
  vct: 'urn:eudi:ehic:1',
  claimQuery: (attribute: DataElement) => { return { path: sdJwtVcAttributeClaimQuery(attribute, AttestationType.EHIC) } }
}

/*---- PDA1 INSTANCES PER FORMAT ----*/
export const PDA1_MSO_MDOC: MsoMdocAttestation = {
  format: AttestationFormat.MSO_MDOC,
  attestationDef: PDA1_ATTESTATION,
  doctype: 'eu.europa.ec.eudi.pda1.1',
  namespace: 'eu.europa.ec.eudi.pda1.1',
  claimQuery: (attribute: DataElement) => { return msoMdocClaimQuery('eu.europa.ec.eudi.pda1.1', attribute.identifier) }
}
export const PDA1_SD_JWT_VC: SdJwtVcAttestation = {
  format: AttestationFormat.SD_JWT_VC,
  attestationDef: PDA1_ATTESTATION,
  vct: 'urn:eu.europa.ec.eudi:pda1:1',
  claimQuery: (attribute: DataElement) => { return { path: sdJwtVcAttributeClaimQuery(attribute, AttestationType.PDA1) } }
}

function resolveAttribute(attribute: DataElement, attestationType: AttestationType): string {
  let resolvedAttribute = attribute.identifier
  if (attestationType === AttestationType.PID) {
    let mappedAttribute = PID_SD_JWT_VC_ATTRIBUTE_MAP[attribute.identifier];
    resolvedAttribute = mappedAttribute || attribute.identifier;
  }

  return resolvedAttribute;
}

function sdJwtVcAttributeClaimQuery(attribute: DataElement, attestationType: AttestationType): (string | null)[] {
  let resolvedAttribute = resolveAttribute(attribute, attestationType);

  if (attestationType === AttestationType.PID && resolvedAttribute === 'nationalities') {
    return ['nationalities', null];
  } else {
    return resolvedAttribute.split('.');
  }
}

function msoMdocClaimQuery(namespace: string, claimName: string): ClaimsQuery {
  return { path: [namespace, claimName], intent_to_retain: false }
}

export const PID_SD_JWT_VC_ATTRIBUTE_MAP: { [id: string]: string } = {
  "birth_date": "birthdate",
  "age_over_18": "age_equal_or_over.18",
  "family_name_birth": "birth_family_name",
  "given_name_birth": "birth_given_name",
  "birth_place": "place_of_birth.locality",
  "resident_address": "address.formatted",
  "resident_country": "address.country",
  "resident_state": "address.region",
  "resident_city": "address.locality",
  "resident_postal_code": "address.postal_code",
  "resident_street": "address.street_address",
  "resident_house_number": "address.house_number",
  "nationality": "nationalities",
  "issuance_date": "date_of_issuance",
  "expiry_date": "date_of_expiry",
  "email_address": "email",
  "mobile_phone_number": "phone_number",
  "portrait": "picture"
}

export const ATTESTATIONS_BY_FORMAT: { [id: string]: Attestation[] } = {
  "mso_mdoc": [PID_MSO_MDOC, MDL_MSO_MDOC, PHOTO_ID_MSO_MDOC, AGE_OVER_18_MSO_MDOC, EHIC_MSO_MDOC, PDA1_MSO_MDOC],
  "dc+sd-jwt": [PID_SD_JWT_VC, EHIC_SD_JWT_VC, PDA1_SD_JWT_VC, EHIC_SD_JWT_VC_DC4EU]
}

export const getAttestationByFormatAndType =
  (type: AttestationType, format: AttestationFormat): Attestation | null => {
    let filtered = ATTESTATIONS_BY_FORMAT[format as string].filter((attestation: Attestation) =>
      attestation.attestationDef.type === type
    );
    return filtered ? filtered[0] : null;
  }
