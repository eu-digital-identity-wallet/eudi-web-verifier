import { Attestation } from "@core/models/attestation/Attestation";
import { AttestationType } from "@core/models/attestation/AttestationType";
import { AttestationFormat } from "@core/models/attestation/AttestationFormat";

export const PID_ATTESTATION: Attestation = {
  name: "Person Identification Data (PID)",
  type: AttestationType.PID,
  dataSet: [
    // Mandatory as per PID Rulebook (ARF 1.8.0)
    { identifier: 'family_name', attribute: 'Family name' },
    { identifier: 'given_name', attribute: 'Given name' },
    { identifier: 'birth_date', attribute: 'Birthdate' },
    { identifier: 'birth_place', attribute: 'Birth place' },
    { identifier: 'nationality', attribute: 'Nationality' },

    // Mandatory metadata as per CIR 2024/2977
    { identifier: 'expiry_date', attribute: 'Expiry date' },
    { identifier: 'issuing_authority', attribute: 'Issuing authority' },
    { identifier: 'issuing_country', attribute: 'Issuing country' },

    // Optional as specified in CIR 2024/2977
    { identifier: 'resident_address', attribute: 'Resident address' },
    { identifier: 'resident_country', attribute: 'Resident country' },
    { identifier: 'resident_state', attribute: 'Resident state' },
    { identifier: 'resident_city', attribute: 'Resident city' },
    { identifier: 'resident_postal_code', attribute: 'Resident postal code' },
    { identifier: 'resident_street', attribute: 'Resident street' },
    { identifier: 'resident_house_number', attribute: 'Resident house number' },
    { identifier: 'personal_administrative_number', attribute: 'Personal administrative number' },
    { identifier: 'portrait', attribute: 'Portrait' },
    { identifier: 'family_name_birth', attribute: 'Family name birth' },
    { identifier: 'given_name_birth', attribute: 'Given name birth' },
    { identifier: 'sex', attribute: 'Sex' },
    { identifier: 'email_address', attribute: 'E-mail address' },
    { identifier: 'mobile_phone_number', attribute: 'Mobile phone numeber' },

    // Optional metadata as per CIR 2024/2977
    { identifier: 'document_number', attribute: 'Document number' },
    { identifier: 'issuing_jurisdiction', attribute: 'Issuing jurisdiction' },
    { identifier: 'location_status', attribute: 'Location of validity status information' },

    // Additional attributes from PID Rulebook (ARF 1.8.0)
    { identifier: 'issuance_date', attribute: 'Issuance date' },
    { identifier: 'age_over_18', attribute: 'Age over 18' },
    { identifier: 'age_over_21', attribute: 'Age over 21' },
    { identifier: 'age_in_years', attribute: 'Age in years' },
    { identifier: 'age_birth_year', attribute: 'Age birth year' },
    { identifier: 'trust_anchor', attribute: 'URL of the trust anchor for verifying PID' },
  ]
}

export const MDL_ATTESTATION: Attestation = {
  name: "Mobile Driving Licence (MDL)",
  type: AttestationType.MDL,
  dataSet: [
    // Mandotory as per ISO-18013:5
    { identifier: 'family_name', attribute: 'Family name' },
    { identifier: 'given_name', attribute: 'Given name' },
    { identifier: 'birth_date', attribute: 'Birthdate' },
    { identifier: 'issue_date', attribute: 'Issue date' },
    { identifier: 'expiry_date', attribute: 'Expiry date' },
    { identifier: 'issuing_country', attribute: 'Issuing country' },
    { identifier: 'issuing_authority', attribute: 'Issuing authority' },
    { identifier: 'document_number', attribute: 'Document number' },
    { identifier: 'portrait', attribute: 'Portrait' },
    { identifier: 'driving_privileges', attribute: 'Driving privileges' },
    { identifier: 'un_distinguishing_sign', attribute: 'UN distinguishing sign' },

    // Optional
    { identifier: 'administrative_number', attribute: 'Administrative number' },
    { identifier: 'sex', attribute: 'Sex' },
    { identifier: 'height', attribute: 'Height' },
    { identifier: 'weight', attribute: 'Weight' },
    { identifier: 'eye_colour', attribute: 'Eye colour' },
    { identifier: 'hair_colour', attribute: 'Hair colour' },
    { identifier: 'birth_place', attribute: 'Birth place' },
    { identifier: 'resident_address', attribute: 'Resident address' },
    { identifier: 'portrait_capture_date', attribute: 'Portrait capture date' },
    { identifier: 'age_in_years', attribute: 'Age in years' },
    { identifier: 'age_birth_year', attribute: 'Age birth year' },
    { identifier: 'age_over_18', attribute: 'Age over 18' }, // Mandatory for Potential
    { identifier: 'age_over_21', attribute: 'Age over 21' },
    { identifier: 'issuing_jurisdiction', attribute: 'Issuing jurisdiction' },
    { identifier: 'nationality', attribute: 'Nationality' },
    { identifier: 'resident_city', attribute: 'Resident city' },
    { identifier: 'resident_state', attribute: 'Resident state/province/district' },
    { identifier: 'resident_postal_code', attribute: 'Resident postal code' },
    { identifier: 'resident_country', attribute: 'Resident country' },
    { identifier: 'family_name_national_character', attribute: 'Family name national character' },
    { identifier: 'given_name_national_character', attribute: 'Given name national character' },
    { identifier: 'signature_usual_mark', attribute: 'Signature usual mark' } // Mandatory for Potential
  ]
}

export const AGE_OVER_18_ATTESTATION: Attestation = {
  name: "Age Over 18",
  type: AttestationType.AGE_OVER_18,
  dataSet: [
    { identifier: 'age_over_18', attribute: 'Age over 18' },
    { identifier: 'user_pseudonym', attribute: 'User pseudonym' },
    { identifier: 'issuance_date', attribute: 'Issuance date' },
    { identifier: 'expiry_date', attribute: 'Expiry date' },
    { identifier: 'issuing_authority', attribute: 'Issuing authority' },
    { identifier: 'issuing_jurisdiction', attribute: 'Issuing jurisdiction' },
    { identifier: 'issuing_country', attribute: 'Issuing country' }
  ]
}

export const PHOTO_ID_ATTESTATION: Attestation = {
  name: "Photo ID",
  type: AttestationType.PHOTO_ID,
  dataSet: [
    { identifier: 'portrait', attribute: 'Portrait' },
    { identifier: 'portrait_capture_date', attribute: 'Portrait capture date' },
    { identifier: 'person_id', attribute: 'Person id' },
    { identifier: 'family_name', attribute: 'Family_name' },
    { identifier: 'given_name', attribute: 'Given name' },
    { identifier: 'birth_date', attribute: 'Birth date' },
    { identifier: 'age_over_18', attribute: 'Age over 18' },
    { identifier: 'age_over_NN', attribute: 'Age over NN' },
    { identifier: 'age_in_years', attribute: 'Age in years' },
    { identifier: 'age_birth_year', attribute: 'Age birth year' },
    { identifier: 'family_name_birth', attribute: 'Family name birth' },
    { identifier: 'given_name_birth', attribute: 'Given name birth' },
    { identifier: 'birth_place', attribute: 'Birth place' },
    { identifier: 'birth_country', attribute: 'Birth country' },
    { identifier: 'birth_state', attribute: 'Birth state' },
    { identifier: 'birth_city', attribute: 'Birth city' },
    { identifier: 'resident_address', attribute: 'Resident address' },
    { identifier: 'resident_country', attribute: 'Resident country' },
    { identifier: 'resident_state', attribute: 'Resident state' },
    { identifier: 'resident_city', attribute: 'Resident city' },
    { identifier: 'resident_postal_code', attribute: 'Resident postal code' },
    { identifier: 'resident_street', attribute: 'Resident street' },
    { identifier: 'resident_house_number', attribute: 'Resident house number' },
    { identifier: 'gender', attribute: 'Gender' },
    { identifier: 'nationality', attribute: 'Nationality' },
    { identifier: 'issuance_date', attribute: 'Issuance date' },
    { identifier: 'expiry_date', attribute: 'Expiry date' },
    { identifier: 'issuing_authority', attribute: 'Issuing authority' },
    { identifier: 'document_number', attribute: 'Document number' },
    { identifier: 'administrative_number', attribute: 'Administrative number' },
    { identifier: 'issuing_country', attribute: 'Issuing country' },
    { identifier: 'issuing_jurisdiction', attribute: 'Issuing jurisdiction' }
  ]
}

export const SUPPORTED_ATTESTATIONS: { [id: string]: Attestation } = {
  "pid": PID_ATTESTATION,
  "mdl": MDL_ATTESTATION,
  "photo_id": PHOTO_ID_ATTESTATION,
  "age_over_18": AGE_OVER_18_ATTESTATION,
}

export const SUPPORTED_FORMATS: AttestationFormat[] = [
  AttestationFormat.MSO_MDOC
]

