import { DCQL } from './dcql/DCQL';

export type RequestUriMethod = 'get' | 'post';
export type Profile = 'haip' | 'openid4vp';

export type TransactionInitializationRequest = {
  nonce: string;
  request_uri_method: RequestUriMethod;
  dcql_query: DCQL;
  issuer_chain?: string;
  profile: Profile;
};

export type PresentationQuery = DCQL;
