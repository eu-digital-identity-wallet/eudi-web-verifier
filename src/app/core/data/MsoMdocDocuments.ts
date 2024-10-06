import {MsoMdocAttestation} from "@core/models/attestation/MsoMdocAttestation";
import {AGE_OVER_18_ATTESTATION, MDL_ATTESTATION, PHOTO_ID_ATTESTATION, PID_ATTESTATION} from "@core/constants/attestations-supported";

/* eslint-disable quotes */
export const MDL_MSO_MDOC: MsoMdocAttestation = {
  attestation: MDL_ATTESTATION,
  doctype: 'org.iso.18013.5.1.mDL',
  namespace: 'org.iso.18013.5.1'
}

/* eslint-disable quotes */
export const PID_MSO_MDOC: MsoMdocAttestation = {
  attestation: PID_ATTESTATION,
  doctype: 'eu.europa.ec.eudi.pid.1',
  namespace: 'eu.europa.ec.eudi.pid.1'
}

/* eslint-disable quotes */
export const AGE_OVER_18_MSO_MDOC: MsoMdocAttestation = {
  attestation: AGE_OVER_18_ATTESTATION,
  doctype: 'eu.europa.ec.eudi.pseudonym.age_over_18.1',
  namespace: 'eu.europa.ec.eudi.pseudonym.age_over_18.1'
}

/* eslint-disable quotes */
export const PHOTO_ID_MSO_MDOC: MsoMdocAttestation = {
  attestation: PHOTO_ID_ATTESTATION,
  doctype: 'org.iso.23220.2.photoid.1',
  namespace: 'org.iso.23220.2.photoid.1'
}
