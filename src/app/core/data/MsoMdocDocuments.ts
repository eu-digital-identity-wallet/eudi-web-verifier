import {MsoMdoc} from "@core/models/MsoMdoc";

/* eslint-disable quotes */
export const MDL_MSO_MDOC: MsoMdoc = {
  name: 'Mobile Driving Licence',
  doctype: 'org.iso.18013.5.1.mDL',
  namespace: 'org.iso.18013.5.1',
  attributes: [
    { value: 'family_name', text: 'Family name' },
    { value: 'given_name', text: 'Given name'},
    { value: 'birth_date', text: 'Birthdate'},
    { value: 'issue_date', text: 'Issue date'},
    { value: 'expiry_date', text: 'Expiry date'},
    { value: 'age_over_18', text: 'Age over 18'},
    { value: 'age_over_21', text: 'Age over 21'},
    { value: 'age_in_years', text: 'Age in years'},
    { value: 'age_birth_year', text: 'Age birth year'},
    { value: 'issuing_authority', text: 'Issuing authority'},
    { value: 'document_number', text: 'Document number'},
    { value: 'portrait', text: 'Portrait'},
    { value: 'driving_privileges', text: 'Driving privileges'},
    { value: 'un_distinguishing_sign', text: 'Un-distinguishing sign'},
    { value: 'administrative_number', text: 'Administrative number'},
    { value: 'sex', text: 'Sex'},
    { value: 'height', text: 'Height'},
    { value: 'weight', text: 'Weight'},
    { value: 'eye_colour', text: 'Eye colour'},
    { value: 'hair_colour', text: 'Hair colour'},
    { value: 'birth_place', text: 'Birth place'},
    { value: 'resident_address', text: 'Resident address'},
    { value: 'portrait_capture_date', text: 'Portrait capture date'},
    { value: 'nationality', text: 'Nationality'},
    { value: 'resident_city', text: 'Resident city'},
    { value: 'resident_state', text: 'Resident state'},
    { value: 'resident_postal_code', text: 'Resident postal code'},
    { value: 'resident_country', text: 'Resident country'},
    { value: 'family_name_national_character', text: 'Family name national character'},
    { value: 'given_name_national_character', text: 'Given name national character'},
    { value: 'signature_usual_mark', text: 'Signature usual mark'}]
}

/* eslint-disable quotes */
export const PID_MSO_MDOC: MsoMdoc = {
  name: 'EUDI PID',
  doctype: 'eu.europa.ec.eudi.pid.1',
  namespace: 'eu.europa.ec.eudi.pid.1',
  attributes: [
    { value: 'family_name', text: 'Family name'},
    { value: 'given_name', text: 'Given name'},
    { value: 'birth_date', text: 'Birthdate'},
    { value: 'age_over_18', text: 'Age over 18'},
    { value: 'age_in_years', text: 'Age in years'},
    { value: 'age_birth_year', text: 'Age birth year'},
    { value: 'family_name_birth', text: 'Family name birth'},
    { value: 'given_name_birth', text: 'Given name birth'},
    { value: 'birth_place', text: 'Birth place'},
    { value: 'birth_country', text: 'Birth country'},
    { value: 'birth_state', text: 'Birth state'},
    { value: 'birth_city', text: 'Birth city'},
    { value: 'resident_address', text: 'Resident address'},
    { value: 'resident_country', text: 'Resident country'},
    { value: 'resident_state', text: 'Resident state'},
    { value: 'resident_city', text: 'Resident city'},
    { value: 'resident_postal_code', text: 'Resident postal code'},
    { value: 'resident_street', text: 'Resident street'},
    { value: 'resident_house_number', text: 'Resident house number'},
    { value: 'gender', text: 'Gender'},
    { value: 'nationality', text: 'Nationality'},
    { value: 'issuance_date', text: 'Issuance date'},
    { value: 'expiry_date', text: 'Expiry date'},
    { value: 'issuing_authority', text: 'Issuing authority'},
    { value: 'document_number', text: 'Document number'},
    { value: 'administrative_number', text: 'Administrative number'},
    { value: 'issuing_country', text: 'Issuing country'},
    { value: 'issuing_jurisdiction', text: 'Issuing jurisdiction'}
  ]
}

/* eslint-disable quotes */
export const AGE_OVER_18_MSO_MDOC: MsoMdoc = {
  name: 'Age Over 18 Attestation',
  doctype: 'eu.europa.ec.eudi.pseudonym.age_over_18.1',
  namespace: 'eu.europa.ec.eudi.pseudonym.age_over_18.1',
  attributes: [
    { value: 'age_over_18', text: 'Age over 18'},
    { value: 'user_pseudonym', text: 'User pseudonym'},
    { value: 'issuance_date', text: 'Issuance date'},
    { value: 'expiry_date', text: 'Expiry date'},
    { value: 'issuing_authority', text: 'Issuing authority'},
    { value: 'issuing_jurisdiction', text: 'Issuing jurisdiction'},
    { value: 'issuing_country', text: 'Issuing country'}
  ]
}
