export type InitializedTransaction = {
  client_id: string,
  request_uri: string,
  request_uri_method: 'get' | 'post',
  transaction_id: string
}
