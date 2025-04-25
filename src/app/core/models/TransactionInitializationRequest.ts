import { DCQL } from './dcql/DCQL';
import { PresentationDefinition } from './presentation/PresentationDefinition';

export type TransactionInitializationRequest =
  | PresentationDefinitionTransactionRequest
  | DCQLTransactionRequest;

export type BaseTransactionInitializationRequest = {
  type: 'id_token' | 'vp_token' | 'vp_token id_token';
  nonce: string;
  request_uri_method: 'get' | 'post';
  issuer_chain?: string;
};

export type PresentationQuery =
  | PresentationDefinition
  | DCQL;

export type PresentationDefinitionTransactionRequest =
  BaseTransactionInitializationRequest & {
    presentation_definition: PresentationDefinition;
  };

export type DCQLTransactionRequest = BaseTransactionInitializationRequest & {
  dcql_query: DCQL;
};

export function isDCQLTransactionRequest(
  request: TransactionInitializationRequest
): request is DCQLTransactionRequest {
  return 'dcql_query' in request;
}

export function isPresentationDefinitionTransactionRequest(
  request: TransactionInitializationRequest
): request is PresentationDefinitionTransactionRequest {
  return 'presentation_definition' in request;
}