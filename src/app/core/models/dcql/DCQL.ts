export type DCQL = {
  credentials: CredentialQuery[];
  credential_sets?: CredentialSetQuery[];
};

export type CredentialQuery = {
  id: QueryId;
  format: 'mso_mdoc' | 'dc+sd-jwt' | 'jwt_vc_json';
  meta?: Object;
  claims?: ClaimsQuery[];
  claim_sets?: ClaimSet[];
};

export type CredentialSetQuery = {
  options: Set<QueryId>[];
  purpose?: string | number | Object;
  required?: boolean;
};

export type BaseClaimQuery = {
  id?: ClaimId;
  values?: Object[];
};

export type JsonClaimQuery = {
  path: ClaimPath[];
};

export type MsoMdocClaimQueryExtension = {
  namespace: string;
  claimName: string;
};

export type ClaimsQuery = BaseClaimQuery &
  (JsonClaimQuery | MsoMdocClaimQueryExtension);

export type QueryId = string;
export type ClaimId = string;
export type ClaimSet = ClaimId[];
export type ClaimPath = ClaimPathElement[];
export type ClaimPathElement = {};
