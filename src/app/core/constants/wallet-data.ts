import { TransactionInitializationRequest } from "../models/TransactionInitializationRequest"
import { MDL_ATTESTATION, PID_ATTESTATION } from "./attestations";
export type RequestType = 'PID' | 'PIDMDL' | 'MDL' | 'PartialMDL' | 'PartialMDLUnderage';

export const PID: TransactionInitializationRequest = {
    "type": "vp_token",
    "presentation_definition": {
        "id": "2077883f-ebde-4c0c-aaaf-6ea64753ed33",
        "input_descriptors": [
            {
                "id": "eu.europa.ec.eudi.pid.1",
                "name": "Person Identification Data (PID)",
                "purpose": "Full PID Request",
                "format": {
                    "mso_mdoc": {
                        "alg": [
                            "ES256",
                            "ES384",
                            "ES512"
                        ]
                    }
                },
                "constraints": {
                    "limit_disclosure": "required",
                    "fields": PID_ATTESTATION.dataSet.map((item) => {
                        return {
                            "path": [
                                "$['eu.europa.ec.eudi.pid.1']" + "['" + item.identifier + "']"
                            ],
                            "intent_to_retain": false
                        };
                    })
                }
            }
        ]
    },
    "nonce": "526fc06c-17ea-4b46-ab15-6b7c7c99607b"
}

export const MDL: TransactionInitializationRequest = {
    "type": "vp_token",
    "presentation_definition": {
        "id": "8d49ba84-d0b5-4639-a1cc-11ef9c1951ad",
        "input_descriptors": [
            {
                "id": "org.iso.18013.5.1.mDL",
                "name": "Mobile Driving Licence (MDL)",
                "purpose": "Full mDL request",
                "format": {
                    "mso_mdoc": {
                        "alg": [
                            "ES256",
                            "ES384",
                            "ES512"
                        ]
                    }
                },
                "constraints": {
                    "limit_disclosure": "required",
                    "fields": MDL_ATTESTATION.dataSet.map((item) => {
                        return {
                            "path": [
                                "$['org.iso.18013.5.1']" + "['" + item.identifier + "']"
                            ],
                            "intent_to_retain": false
                        };
                    })
                }
            }
        ]
    },
    "nonce": "d5fbcc4a-53b9-40b4-8da8-af151ece74a1"
}

export const PIDMDL: TransactionInitializationRequest = {
    "type": "vp_token",
    "presentation_definition": {
        "id": "b1473a98-46ac-4706-b126-f18c96a85844",
        "input_descriptors": [
            {
                "id": "eu.europa.ec.eudi.pid.1",
                "name": "Person Identification Data (PID)",
                "purpose": "Full PID request",
                "format": {
                    "mso_mdoc": {
                        "alg": [
                            "ES256",
                            "ES384",
                            "ES512"
                        ]
                    }
                },
                "constraints": {
                    "limit_disclosure": "required",
                    "fields": PID_ATTESTATION.dataSet.map((item) => {
                        return {
                            "path": [
                                "$['eu.europa.ec.eudi.pid.1']" + "['" + item.identifier + "']"
                            ],
                            "intent_to_retain": false
                        };
                    })
                }
            },
            {
                "id": "org.iso.18013.5.1.mDL",
                "name": "Mobile Driving Licence (MDL)",
                "purpose": "Full mDL test request",
                "format": {
                    "mso_mdoc": {
                        "alg": [
                            "ES256",
                            "ES384",
                            "ES512"
                        ]
                    }
                },
                "constraints": {
                    "limit_disclosure": "required",
                    "fields": MDL_ATTESTATION.dataSet.map((item) => {
                        return {
                            "path": [
                                "$['org.iso.18013.5.1']" + "['" + item.identifier + "']"
                            ],
                            "intent_to_retain": false
                        };
                    })
                }
            }
        ]
    },
    "nonce": "3410df23-af2e-40e8-9aea-64163c2e0823"
}

export const PartialMDL: TransactionInitializationRequest = {
    "type": "vp_token",
    "presentation_definition": {
        "id": "97abcaa9-f1a0-4d36-9a27-3874f0a8fc88",
        "input_descriptors": [
            {
                "id": "org.iso.18013.5.1.mDL",
                "name": "Mobile Driving Licence (MDL)",
                "purpose": "Partial mDL test request",
                "format": {
                    "mso_mdoc": {
                        "alg": [
                            "ES256",
                            "ES384",
                            "ES512"
                        ]
                    }
                },
                "constraints": {
                    "limit_disclosure": "required",
                    "fields": [
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['family_name']"
                            ],
                            "intent_to_retain": false
                        },
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['given_name']"
                            ],
                            "intent_to_retain": false
                        },
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['birth_date']"
                            ],
                            "intent_to_retain": false
                        },
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['issue_date']"
                            ],
                            "intent_to_retain": false
                        },
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['expiry_date']"
                            ],
                            "intent_to_retain": false
                        },
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['driving_privileges']"
                            ],
                            "intent_to_retain": false
                        }
                    ]
                }
            }
        ]
    },
    "nonce": "97a45ebc-285e-4283-b8bd-507184f6ffa1"
}

export const PartialMDLUnderage: TransactionInitializationRequest = {
    "type": "vp_token",
    "presentation_definition": {
        "id": "cf6f9522-11be-46ae-a449-82355f2e6d34",
        "input_descriptors": [
            {
                "id": "org.iso.18013.5.1.mDL",
                "name": "Mobile Driving Licence (MDL)",
                "purpose": "Partial mDL (Underage) request",
                "format": {
                    "mso_mdoc": {
                        "alg": [
                            "ES256",
                            "ES384",
                            "ES512"
                        ]
                    }
                },
                "constraints": {
                    "limit_disclosure": "required",
                    "fields": [
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['family_name']"
                            ],
                            "intent_to_retain": false
                        },
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['given_name']"
                            ],
                            "intent_to_retain": false
                        },
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['birth_date']"
                            ],
                            "intent_to_retain": false
                        },
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['issue_date']"
                            ],
                            "intent_to_retain": false
                        },
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['expiry_date']"
                            ],
                            "intent_to_retain": false
                        },
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['age_over_18']"
                            ],
                            "intent_to_retain": false
                        },
                        {
                            "path": [
                                "$['org.iso.18013.5.1']['driving_privileges']"
                            ],
                            "intent_to_retain": false
                        }
                    ]
                }
            }
        ]
    },
    "nonce": "160cfe93-daf3-4969-bc40-4b269b93c228"
}