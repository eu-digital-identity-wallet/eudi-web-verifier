import { RequestUriMethod } from "./TransactionInitializationRequest"

export type InitializedTransaction = {
  client_id: string,
  request_uri: string,
  request_uri_method: RequestUriMethod,
  transaction_id: string,
  authorization_request_uri: string
}
