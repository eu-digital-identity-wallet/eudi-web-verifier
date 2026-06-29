import {RequestUriMethod} from "./TransactionInitializationRequest"

export type InitializedTransaction = RedirectsTransaction | DcApiTransaction;

export type RedirectsTransaction = {
  client_id: string,
  request_uri: string,
  request_uri_method: RequestUriMethod,
  transaction_id: string,
  authorization_request_uri: string
}

export type DcApiTransaction = {
  transaction_id: string,
  request: string,
}
