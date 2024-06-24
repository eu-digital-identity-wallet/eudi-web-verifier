import {MsoMdoc} from "@core/models/msoMdoc";

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


