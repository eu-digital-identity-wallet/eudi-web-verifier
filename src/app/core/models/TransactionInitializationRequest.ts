import { DCQL } from './dcql/DCQL';

export type TransactionInitializationRequest = {
  type: 'id_token' | 'vp_token' | 'vp_token id_token';
  nonce: string;
  request_uri_method: 'get' | 'post';
  dcql_query: DCQL;
  issuer_chain?: string;
};

export type PresentationQuery = DCQL;
