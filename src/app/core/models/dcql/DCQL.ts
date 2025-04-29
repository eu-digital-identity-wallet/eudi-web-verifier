export type DCQL = {
  credentials: CredentialQuery[];
  credential_sets?: CredentialSetQuery[];
};

export type CredentialQuery = {
  id: QueryId;
  format: 'mso_mdoc' | 'dc+sd-jwt' | 'jwt_vc_json' | 'vc+sd-jwt';
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
  path: string[];
};

export type MsoMdocClaimQueryExtension = {
  namespace: string;
  claim_name: string;
};

export type ClaimsQuery = BaseClaimQuery &
  (JsonClaimQuery | MsoMdocClaimQueryExtension);

export type QueryId = string;
export type ClaimId = string;
export type ClaimSet = ClaimId[];
export type ClaimPath = string[];
export type ClaimPathElement = {};
