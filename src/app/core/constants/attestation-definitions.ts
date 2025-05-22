import {AttestationDefinition} from "@core/models/attestation/AttestationDefinition";
import {AttestationType} from "@core/models/attestation/AttestationType";

export const PID_ATTESTATION: AttestationDefinition = {
  name: "Person Identification Data (PID)",
  type: AttestationType.PID,
  dataSet: [
    { identifier: 'family_name', attribute: 'Family name'},
    { identifier: 'given_name', attribute: 'Given name'},
    { identifier: 'birth_date', attribute: 'Birthdate'},
    { identifier: 'age_over_18', attribute: 'Age over 18'},
    { identifier: 'age_in_years', attribute: 'Age in years'},
    { identifier: 'age_birth_year', attribute: 'Age birth year'},
    { identifier: 'family_name_birth', attribute: 'Family name birth'},
    { identifier: 'given_name_birth', attribute: 'Given name birth'},
    { identifier: 'birth_place', attribute: 'Birth place'},
    { identifier: 'resident_address', attribute: 'Resident address'},
    { identifier: 'resident_country', attribute: 'Resident country'},
    { identifier: 'resident_state', attribute: 'Resident state'},
    { identifier: 'resident_city', attribute: 'Resident city'},
    { identifier: 'resident_postal_code', attribute: 'Resident postal code'},
    { identifier: 'resident_street', attribute: 'Resident street'},
    { identifier: 'resident_house_number', attribute: 'Resident house number'},
    { identifier: 'sex', attribute: 'Sex'},
    { identifier: 'nationality', attribute: 'Nationality'},
    { identifier: 'issuance_date', attribute: 'Issuance date'},
    { identifier: 'expiry_date', attribute: 'Expiry date'},
    { identifier: 'issuing_authority', attribute: 'Issuing authority'},
    { identifier: 'document_number', attribute: 'Document number'},
    { identifier: 'personal_administrative_number', attribute: 'Personal administrative number'},
    { identifier: 'issuing_country', attribute: 'Issuing country'},
    { identifier: 'issuing_jurisdiction', attribute: 'Issuing jurisdiction'},
    { identifier: 'portrait', attribute: 'Portrait'},
    { identifier: 'email_address', attribute: 'Email address'},
    { identifier: 'mobile_phone_number', attribute: 'Mobile phone number'},
    { identifier: 'trust_anchor', attribute: 'Trust anchor'},
  ]
}

export const MDL_ATTESTATION: AttestationDefinition = {
  name: "Mobile Driving Licence (MDL)",
  type: AttestationType.MDL,
  dataSet: [
    { identifier: 'family_name', attribute: 'Family name' },
    { identifier: 'given_name', attribute: 'Given name'},
    { identifier: 'birth_date', attribute: 'Birthdate'},
    { identifier: 'issue_date', attribute: 'Issue date'},
    { identifier: 'expiry_date', attribute: 'Expiry date'},
    { identifier: 'age_over_18', attribute: 'Age over 18'},
    { identifier: 'age_over_21', attribute: 'Age over 21'},
    { identifier: 'age_in_years', attribute: 'Age in years'},
    { identifier: 'age_birth_year', attribute: 'Age birth year'},
    { identifier: 'issuing_authority', attribute: 'Issuing authority'},
    { identifier: 'document_number', attribute: 'Document number'},
    { identifier: 'portrait', attribute: 'Portrait'},
    { identifier: 'driving_privileges', attribute: 'Driving privileges'},
    { identifier: 'un_distinguishing_sign', attribute: 'Un-distinguishing sign'},
    { identifier: 'administrative_number', attribute: 'Administrative number'},
    { identifier: 'sex', attribute: 'Sex'},
    { identifier: 'height', attribute: 'Height'},
    { identifier: 'weight', attribute: 'Weight'},
    { identifier: 'eye_colour', attribute: 'Eye colour'},
    { identifier: 'hair_colour', attribute: 'Hair colour'},
    { identifier: 'birth_place', attribute: 'Birth place'},
    { identifier: 'resident_address', attribute: 'Resident address'},
    { identifier: 'portrait_capture_date', attribute: 'Portrait capture date'},
    { identifier: 'nationality', attribute: 'Nationality'},
    { identifier: 'resident_city', attribute: 'Resident city'},
    { identifier: 'resident_state', attribute: 'Resident state'},
    { identifier: 'resident_postal_code', attribute: 'Resident postal code'},
    { identifier: 'resident_country', attribute: 'Resident country'},
    { identifier: 'family_name_national_character', attribute: 'Family name national character'},
    { identifier: 'given_name_national_character', attribute: 'Given name national character'},
    { identifier: 'signature_usual_mark', attribute: 'Signature usual mark'}
  ]
}

export const AGE_OVER_18_ATTESTATION: AttestationDefinition = {
  name: "Age Over 18",
  type: AttestationType.AGE_OVER_18,
  dataSet: [
    { identifier: 'age_over_18', attribute: 'Age over 18'},
    { identifier: 'user_pseudonym', attribute: 'User pseudonym'},
    { identifier: 'issuance_date', attribute: 'Issuance date'},
    { identifier: 'expiry_date', attribute: 'Expiry date'},
    { identifier: 'issuing_authority', attribute: 'Issuing authority'},
    { identifier: 'issuing_jurisdiction', attribute: 'Issuing jurisdiction'},
    { identifier: 'issuing_country', attribute: 'Issuing country'}
  ]
}

export const PHOTO_ID_ATTESTATION: AttestationDefinition = {
  name: "Photo ID",
  type: AttestationType.PHOTO_ID,
  dataSet: [
    { identifier: 'portrait', attribute: 'Portrait'},
    { identifier: 'portrait_capture_date', attribute: 'Portrait capture date'},
    { identifier: 'person_id', attribute: 'Person id'},
    { identifier: 'family_name', attribute: 'Family name'},
    { identifier: 'given_name', attribute: 'Given name'},
    { identifier: 'birth_date', attribute: 'Birth date'},
    { identifier: 'age_over_18', attribute: 'Age over 18'},
    { identifier: 'age_over_NN', attribute: 'Age over NN'},
    { identifier: 'age_in_years', attribute: 'Age in years'},
    { identifier: 'age_birth_year', attribute: 'Age birth year'},
    { identifier: 'family_name_birth', attribute: 'Family name birth'},
    { identifier: 'given_name_birth', attribute: 'Given name birth'},
    { identifier: 'birth_place', attribute: 'Birth place'},
    { identifier: 'birth_country', attribute: 'Birth country'},
    { identifier: 'birth_state', attribute: 'Birth state'},
    { identifier: 'birth_city', attribute: 'Birth city'},
    { identifier: 'resident_address', attribute: 'Resident address'},
    { identifier: 'resident_country', attribute: 'Resident country'},
    { identifier: 'resident_state', attribute: 'Resident state'},
    { identifier: 'resident_city', attribute: 'Resident city'},
    { identifier: 'resident_postal_code', attribute: 'Resident postal code'},
    { identifier: 'resident_street', attribute: 'Resident street'},
    { identifier: 'resident_house_number', attribute: 'Resident house number'},
    { identifier: 'gender', attribute: 'Gender'},
    { identifier: 'nationality', attribute: 'Nationality'},
    { identifier: 'issuance_date', attribute: 'Issuance date'},
    { identifier: 'expiry_date', attribute: 'Expiry date'},
    { identifier: 'issuing_authority', attribute: 'Issuing authority'},
    { identifier: 'document_number', attribute: 'Document number'},
    { identifier: 'administrative_number', attribute: 'Administrative number'},
    { identifier: 'issuing_country', attribute: 'Issuing country'},
    { identifier: 'issuing_jurisdiction', attribute: 'Issuing jurisdiction'}
  ]
}

export const EHIC_ATTESTATION: AttestationDefinition = {
  name: "European Health Insurance Card (EHIC)",
  type: AttestationType.EHIC,
  dataSet: [
    { identifier: "credential_holder", attribute: "Credential holder" },
    { identifier: "subject", attribute: "Subject" },
    { identifier: 'social_security_pin', attribute: 'Social security PIN'},
    { identifier: "starting_date", attribute: "Starting date" },
    { identifier: "ending_date", attribute: "Ending date" },
    { identifier: 'document_id', attribute: 'Document identifier' },
    { identifier: "competent_institution", attribute: 'Competent institution' }
  ],
}

export const PDA1_ATTESTATION: AttestationDefinition = {
  name: "Portable Document A1 (PDA1)",
  type: AttestationType.PDA1,
  dataSet: [
    { identifier: "credential_holder", attribute: "Credential holder" },
    { identifier: 'social_security_pin', attribute: 'Social security PIN' },
    { identifier: "nationality", attribute: "Nationality" },
    { identifier: "employment_details", attribute: "Employment details" },
    { identifier: 'places_of_work', attribute: 'Places of work' },
    { identifier: 'legislation', attribute: 'Legislation' },
    { identifier: 'status_confirmation', attribute: 'Status confirmation'},
    { identifier: 'document_id', attribute: 'Document identifier'},
    { identifier: "competent_institution", attribute: "Competent institution"},
  ]
}

export const SUPPORTED_ATTESTATIONS: { [id: string]: AttestationDefinition } = {
  "pid": PID_ATTESTATION,
  "mdl": MDL_ATTESTATION,
  "photo_id": PHOTO_ID_ATTESTATION,
  "age_over_18": AGE_OVER_18_ATTESTATION,
  "ehic": EHIC_ATTESTATION,
  "pda1": PDA1_ATTESTATION
}
