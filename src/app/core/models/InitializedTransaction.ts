import {RequestUriMethod} from "./TransactionInitializationRequest"

export type InitializedTransaction = RedirectsTransaction | SignedDcApiTransaction | UnsignedDcApiTransaction;

export type RedirectsTransaction = {
  client_id: string,
  request_uri: string,
  request_uri_method: RequestUriMethod,
  transaction_id: string,
  authorization_request_uri: string
}

export type SignedDcApiTransaction = {
  transaction_id: string,
  request: string,
  origin: string,
  host: string,
}

export type UnsignedDcApiTransaction = {
  transaction_id: string,
  request: {
    response_type: 'vp_token',
    response_mode: 'dc_api' | 'dc_api.jwt',
    nonce: string,
    dcql_query: string,
    client_metadata: any,
    transaction_data: any,
    verifier_info: any
  }
}