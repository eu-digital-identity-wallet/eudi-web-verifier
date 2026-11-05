/**
 * Error codes returned by the verifier backend's GET wallet response endpoint
 * (GET /ui/presentations/{transactionId}) in a 400 response body: {"error": code}.
 */
export const GetWalletResponseErrorCode = {
  PRESENTATION_NOT_SUBMITTED: 'PresentationNotSubmitted',
  INVALID_RESPONSE_CODE: 'InvalidResponseCode',
} as const;
export type GetWalletResponseErrorCode =
  (typeof GetWalletResponseErrorCode)[keyof typeof GetWalletResponseErrorCode];

/**
 * Event names from the verifier backend's presentation events endpoint
 * (GET /ui/presentations/{transactionId}/events) that the polling flow reacts to.
 */
export const PresentationEventName = {
  WALLET_FAILED_TO_POST: 'Wallet failed to post response',
} as const;
